/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { parallel } from './change-detection';
import { ComponentHarness, HarnessPredicate, } from './component-harness';
/**
 * Base harness environment class that can be extended to allow `ComponentHarness`es to be used in
 * different test environments (e.g. testbed, protractor, etc.). This class implements the
 * functionality of both a `HarnessLoader` and `LocatorFactory`. This class is generic on the raw
 * element type, `E`, used by the particular test environment.
 */
export class HarnessEnvironment {
    constructor(rawRootElement) {
        this.rawRootElement = rawRootElement;
    }
    // Implemented as part of the `LocatorFactory` interface.
    get rootElement() {
        this._rootElement = this._rootElement || this.createTestElement(this.rawRootElement);
        return this._rootElement;
    }
    set rootElement(element) {
        this._rootElement = element;
    }
    // Implemented as part of the `LocatorFactory` interface.
    documentRootLocatorFactory() {
        return this.createEnvironment(this.getDocumentRoot());
    }
    // Implemented as part of the `LocatorFactory` interface.
    locatorFor(...queries) {
        return () => _assertResultFound(this._getAllHarnessesAndTestElements(queries), _getDescriptionForLocatorForQueries(queries));
    }
    // Implemented as part of the `LocatorFactory` interface.
    locatorForOptional(...queries) {
        return async () => (await this._getAllHarnessesAndTestElements(queries))[0] || null;
    }
    // Implemented as part of the `LocatorFactory` interface.
    locatorForAll(...queries) {
        return () => this._getAllHarnessesAndTestElements(queries);
    }
    // Implemented as part of the `LocatorFactory` interface.
    async rootHarnessLoader() {
        return this;
    }
    // Implemented as part of the `LocatorFactory` interface.
    async harnessLoaderFor(selector) {
        return this.createEnvironment(await _assertResultFound(this.getAllRawElements(selector), [
            _getDescriptionForHarnessLoaderQuery(selector),
        ]));
    }
    // Implemented as part of the `LocatorFactory` interface.
    async harnessLoaderForOptional(selector) {
        const elements = await this.getAllRawElements(selector);
        return elements[0] ? this.createEnvironment(elements[0]) : null;
    }
    // Implemented as part of the `LocatorFactory` interface.
    async harnessLoaderForAll(selector) {
        const elements = await this.getAllRawElements(selector);
        return elements.map(element => this.createEnvironment(element));
    }
    // Implemented as part of the `HarnessLoader` interface.
    getHarness(query) {
        return this.locatorFor(query)();
    }
    // Implemented as part of the `HarnessLoader` interface.
    getAllHarnesses(query) {
        return this.locatorForAll(query)();
    }
    // Implemented as part of the `HarnessLoader` interface.
    async getChildLoader(selector) {
        return this.createEnvironment(await _assertResultFound(this.getAllRawElements(selector), [
            _getDescriptionForHarnessLoaderQuery(selector),
        ]));
    }
    // Implemented as part of the `HarnessLoader` interface.
    async getAllChildLoaders(selector) {
        return (await this.getAllRawElements(selector)).map(e => this.createEnvironment(e));
    }
    /** Creates a `ComponentHarness` for the given harness type with the given raw host element. */
    createComponentHarness(harnessType, element) {
        return new harnessType(this.createEnvironment(element));
    }
    /**
     * Matches the given raw elements with the given list of element and harness queries to produce a
     * list of matched harnesses and test elements.
     */
    async _getAllHarnessesAndTestElements(queries) {
        if (!queries.length) {
            throw Error('CDK Component harness query must contain at least one element.');
        }
        const { allQueries, harnessQueries, elementQueries, harnessTypes } = _parseQueries(queries);
        // Combine all of the queries into one large comma-delimited selector and use it to get all raw
        // elements matching any of the individual queries.
        const rawElements = await this.getAllRawElements([...elementQueries, ...harnessQueries.map(predicate => predicate.getSelector())].join(','));
        // If every query is searching for the same harness subclass, we know every result corresponds
        // to an instance of that subclass. Likewise, if every query is for a `TestElement`, we know
        // every result corresponds to a `TestElement`. Otherwise we need to verify which result was
        // found by which selector so it can be matched to the appropriate instance.
        const skipSelectorCheck = (elementQueries.length === 0 && harnessTypes.size === 1) || harnessQueries.length === 0;
        const perElementMatches = await parallel(() => rawElements.map(async (rawElement) => {
            const testElement = this.createTestElement(rawElement);
            const allResultsForElement = await parallel(
            // For each query, get `null` if it doesn't match, or a `TestElement` or
            // `ComponentHarness` as appropriate if it does match. This gives us everything that
            // matches the current raw element, but it may contain duplicate entries (e.g.
            // multiple `TestElement` or multiple `ComponentHarness` of the same type).
            () => allQueries.map(query => this._getQueryResultForElement(query, rawElement, testElement, skipSelectorCheck)));
            return _removeDuplicateQueryResults(allResultsForElement);
        }));
        return [].concat(...perElementMatches);
    }
    /**
     * Check whether the given query matches the given element, if it does return the matched
     * `TestElement` or `ComponentHarness`, if it does not, return null. In cases where the caller
     * knows for sure that the query matches the element's selector, `skipSelectorCheck` can be used
     * to skip verification and optimize performance.
     */
    async _getQueryResultForElement(query, rawElement, testElement, skipSelectorCheck = false) {
        if (typeof query === 'string') {
            return skipSelectorCheck || (await testElement.matchesSelector(query)) ? testElement : null;
        }
        if (skipSelectorCheck || (await testElement.matchesSelector(query.getSelector()))) {
            const harness = this.createComponentHarness(query.harnessType, rawElement);
            return (await query.evaluate(harness)) ? harness : null;
        }
        return null;
    }
}
/**
 * Parses a list of queries in the format accepted by the `locatorFor*` methods into an easier to
 * work with format.
 */
function _parseQueries(queries) {
    const allQueries = [];
    const harnessQueries = [];
    const elementQueries = [];
    const harnessTypes = new Set();
    for (const query of queries) {
        if (typeof query === 'string') {
            allQueries.push(query);
            elementQueries.push(query);
        }
        else {
            const predicate = query instanceof HarnessPredicate ? query : new HarnessPredicate(query, {});
            allQueries.push(predicate);
            harnessQueries.push(predicate);
            harnessTypes.add(predicate.harnessType);
        }
    }
    return { allQueries, harnessQueries, elementQueries, harnessTypes };
}
/**
 * Removes duplicate query results for a particular element. (e.g. multiple `TestElement`
 * instances or multiple instances of the same `ComponentHarness` class.
 */
async function _removeDuplicateQueryResults(results) {
    let testElementMatched = false;
    let matchedHarnessTypes = new Set();
    const dedupedMatches = [];
    for (const result of results) {
        if (!result) {
            continue;
        }
        if (result instanceof ComponentHarness) {
            if (!matchedHarnessTypes.has(result.constructor)) {
                matchedHarnessTypes.add(result.constructor);
                dedupedMatches.push(result);
            }
        }
        else if (!testElementMatched) {
            testElementMatched = true;
            dedupedMatches.push(result);
        }
    }
    return dedupedMatches;
}
/** Verifies that there is at least one result in an array. */
async function _assertResultFound(results, queryDescriptions) {
    const result = (await results)[0];
    if (result == undefined) {
        throw Error(`Failed to find element matching one of the following queries:\n` +
            queryDescriptions.map(desc => `(${desc})`).join(',\n'));
    }
    return result;
}
/** Gets a list of description strings from a list of queries. */
function _getDescriptionForLocatorForQueries(queries) {
    return queries.map(query => typeof query === 'string'
        ? _getDescriptionForTestElementQuery(query)
        : _getDescriptionForComponentHarnessQuery(query));
}
/** Gets a description string for a `ComponentHarness` query. */
function _getDescriptionForComponentHarnessQuery(query) {
    const harnessPredicate = query instanceof HarnessPredicate ? query : new HarnessPredicate(query, {});
    const { name, hostSelector } = harnessPredicate.harnessType;
    const description = `${name} with host element matching selector: "${hostSelector}"`;
    const constraints = harnessPredicate.getDescription();
    return (description +
        (constraints ? ` satisfying the constraints: ${harnessPredicate.getDescription()}` : ''));
}
/** Gets a description string for a `TestElement` query. */
function _getDescriptionForTestElementQuery(selector) {
    return `TestElement for element matching selector: "${selector}"`;
}
/** Gets a description string for a `HarnessLoader` query. */
function _getDescriptionForHarnessLoaderQuery(selector) {
    return `HarnessLoader for element matching selector: "${selector}"`;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaGFybmVzcy1lbnZpcm9ubWVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9jZGsvdGVzdGluZy9oYXJuZXNzLWVudmlyb25tZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRztBQUVILE9BQU8sRUFBQyxRQUFRLEVBQUMsTUFBTSxvQkFBb0IsQ0FBQztBQUM1QyxPQUFPLEVBRUwsZ0JBQWdCLEVBR2hCLGdCQUFnQixHQUlqQixNQUFNLHFCQUFxQixDQUFDO0FBcUI3Qjs7Ozs7R0FLRztBQUNILE1BQU0sT0FBZ0Isa0JBQWtCO0lBV3RDLFlBQWdDLGNBQWlCO1FBQWpCLG1CQUFjLEdBQWQsY0FBYyxDQUFHO0lBQUcsQ0FBQztJQVZyRCx5REFBeUQ7SUFDekQsSUFBSSxXQUFXO1FBQ2IsSUFBSSxDQUFDLFlBQVksR0FBRyxJQUFJLENBQUMsWUFBWSxJQUFJLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLENBQUM7UUFDckYsT0FBTyxJQUFJLENBQUMsWUFBWSxDQUFDO0lBQzNCLENBQUM7SUFDRCxJQUFJLFdBQVcsQ0FBQyxPQUFvQjtRQUNsQyxJQUFJLENBQUMsWUFBWSxHQUFHLE9BQU8sQ0FBQztJQUM5QixDQUFDO0lBS0QseURBQXlEO0lBQ3pELDBCQUEwQjtRQUN4QixPQUFPLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxJQUFJLENBQUMsZUFBZSxFQUFFLENBQUMsQ0FBQztJQUN4RCxDQUFDO0lBRUQseURBQXlEO0lBQ3pELFVBQVUsQ0FDUixHQUFHLE9BQVU7UUFFYixPQUFPLEdBQUcsRUFBRSxDQUNWLGtCQUFrQixDQUNoQixJQUFJLENBQUMsK0JBQStCLENBQUMsT0FBTyxDQUFDLEVBQzdDLG1DQUFtQyxDQUFDLE9BQU8sQ0FBQyxDQUM3QyxDQUFDO0lBQ04sQ0FBQztJQUVELHlEQUF5RDtJQUN6RCxrQkFBa0IsQ0FDaEIsR0FBRyxPQUFVO1FBRWIsT0FBTyxLQUFLLElBQUksRUFBRSxDQUFDLENBQUMsTUFBTSxJQUFJLENBQUMsK0JBQStCLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxJQUFJLENBQUM7SUFDdEYsQ0FBQztJQUVELHlEQUF5RDtJQUN6RCxhQUFhLENBQ1gsR0FBRyxPQUFVO1FBRWIsT0FBTyxHQUFHLEVBQUUsQ0FBQyxJQUFJLENBQUMsK0JBQStCLENBQUMsT0FBTyxDQUFDLENBQUM7SUFDN0QsQ0FBQztJQUVELHlEQUF5RDtJQUN6RCxLQUFLLENBQUMsaUJBQWlCO1FBQ3JCLE9BQU8sSUFBSSxDQUFDO0lBQ2QsQ0FBQztJQUVELHlEQUF5RDtJQUN6RCxLQUFLLENBQUMsZ0JBQWdCLENBQUMsUUFBZ0I7UUFDckMsT0FBTyxJQUFJLENBQUMsaUJBQWlCLENBQzNCLE1BQU0sa0JBQWtCLENBQUMsSUFBSSxDQUFDLGlCQUFpQixDQUFDLFFBQVEsQ0FBQyxFQUFFO1lBQ3pELG9DQUFvQyxDQUFDLFFBQVEsQ0FBQztTQUMvQyxDQUFDLENBQ0gsQ0FBQztJQUNKLENBQUM7SUFFRCx5REFBeUQ7SUFDekQsS0FBSyxDQUFDLHdCQUF3QixDQUFDLFFBQWdCO1FBQzdDLE1BQU0sUUFBUSxHQUFHLE1BQU0sSUFBSSxDQUFDLGlCQUFpQixDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQ3hELE9BQU8sUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsaUJBQWlCLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQztJQUNsRSxDQUFDO0lBRUQseURBQXlEO0lBQ3pELEtBQUssQ0FBQyxtQkFBbUIsQ0FBQyxRQUFnQjtRQUN4QyxNQUFNLFFBQVEsR0FBRyxNQUFNLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUN4RCxPQUFPLFFBQVEsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsaUJBQWlCLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztJQUNsRSxDQUFDO0lBRUQsd0RBQXdEO0lBQ3hELFVBQVUsQ0FBNkIsS0FBc0I7UUFDM0QsT0FBTyxJQUFJLENBQUMsVUFBVSxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUM7SUFDbEMsQ0FBQztJQUVELHdEQUF3RDtJQUN4RCxlQUFlLENBQTZCLEtBQXNCO1FBQ2hFLE9BQU8sSUFBSSxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDO0lBQ3JDLENBQUM7SUFFRCx3REFBd0Q7SUFDeEQsS0FBSyxDQUFDLGNBQWMsQ0FBQyxRQUFnQjtRQUNuQyxPQUFPLElBQUksQ0FBQyxpQkFBaUIsQ0FDM0IsTUFBTSxrQkFBa0IsQ0FBQyxJQUFJLENBQUMsaUJBQWlCLENBQUMsUUFBUSxDQUFDLEVBQUU7WUFDekQsb0NBQW9DLENBQUMsUUFBUSxDQUFDO1NBQy9DLENBQUMsQ0FDSCxDQUFDO0lBQ0osQ0FBQztJQUVELHdEQUF3RDtJQUN4RCxLQUFLLENBQUMsa0JBQWtCLENBQUMsUUFBZ0I7UUFDdkMsT0FBTyxDQUFDLE1BQU0sSUFBSSxDQUFDLGlCQUFpQixDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLGlCQUFpQixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDdEYsQ0FBQztJQUVELCtGQUErRjtJQUNyRixzQkFBc0IsQ0FDOUIsV0FBMkMsRUFDM0MsT0FBVTtRQUVWLE9BQU8sSUFBSSxXQUFXLENBQUMsSUFBSSxDQUFDLGlCQUFpQixDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7SUFDMUQsQ0FBQztJQXNCRDs7O09BR0c7SUFDSyxLQUFLLENBQUMsK0JBQStCLENBQzNDLE9BQVU7UUFFVixJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sRUFBRTtZQUNuQixNQUFNLEtBQUssQ0FBQyxnRUFBZ0UsQ0FBQyxDQUFDO1NBQy9FO1FBRUQsTUFBTSxFQUFDLFVBQVUsRUFBRSxjQUFjLEVBQUUsY0FBYyxFQUFFLFlBQVksRUFBQyxHQUFHLGFBQWEsQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUUxRiwrRkFBK0Y7UUFDL0YsbURBQW1EO1FBQ25ELE1BQU0sV0FBVyxHQUFHLE1BQU0sSUFBSSxDQUFDLGlCQUFpQixDQUM5QyxDQUFDLEdBQUcsY0FBYyxFQUFFLEdBQUcsY0FBYyxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsRUFBRSxDQUFDLFNBQVMsQ0FBQyxXQUFXLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUMzRixDQUFDO1FBRUYsOEZBQThGO1FBQzlGLDRGQUE0RjtRQUM1Riw0RkFBNEY7UUFDNUYsNEVBQTRFO1FBQzVFLE1BQU0saUJBQWlCLEdBQ3JCLENBQUMsY0FBYyxDQUFDLE1BQU0sS0FBSyxDQUFDLElBQUksWUFBWSxDQUFDLElBQUksS0FBSyxDQUFDLENBQUMsSUFBSSxjQUFjLENBQUMsTUFBTSxLQUFLLENBQUMsQ0FBQztRQUUxRixNQUFNLGlCQUFpQixHQUFHLE1BQU0sUUFBUSxDQUFDLEdBQUcsRUFBRSxDQUM1QyxXQUFXLENBQUMsR0FBRyxDQUFDLEtBQUssRUFBQyxVQUFVLEVBQUMsRUFBRTtZQUNqQyxNQUFNLFdBQVcsR0FBRyxJQUFJLENBQUMsaUJBQWlCLENBQUMsVUFBVSxDQUFDLENBQUM7WUFDdkQsTUFBTSxvQkFBb0IsR0FBRyxNQUFNLFFBQVE7WUFDekMsd0VBQXdFO1lBQ3hFLG9GQUFvRjtZQUNwRiw4RUFBOEU7WUFDOUUsMkVBQTJFO1lBQzNFLEdBQUcsRUFBRSxDQUNILFVBQVUsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FDckIsSUFBSSxDQUFDLHlCQUF5QixDQUFDLEtBQUssRUFBRSxVQUFVLEVBQUUsV0FBVyxFQUFFLGlCQUFpQixDQUFDLENBQ2xGLENBQ0osQ0FBQztZQUNGLE9BQU8sNEJBQTRCLENBQUMsb0JBQW9CLENBQUMsQ0FBQztRQUM1RCxDQUFDLENBQUMsQ0FDSCxDQUFDO1FBQ0YsT0FBUSxFQUFVLENBQUMsTUFBTSxDQUFDLEdBQUcsaUJBQWlCLENBQUMsQ0FBQztJQUNsRCxDQUFDO0lBRUQ7Ozs7O09BS0c7SUFDSyxLQUFLLENBQUMseUJBQXlCLENBQ3JDLEtBQW1DLEVBQ25DLFVBQWEsRUFDYixXQUF3QixFQUN4QixvQkFBNkIsS0FBSztRQUVsQyxJQUFJLE9BQU8sS0FBSyxLQUFLLFFBQVEsRUFBRTtZQUM3QixPQUFPLGlCQUFpQixJQUFJLENBQUMsTUFBTSxXQUFXLENBQUMsZUFBZSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDO1NBQzdGO1FBQ0QsSUFBSSxpQkFBaUIsSUFBSSxDQUFDLE1BQU0sV0FBVyxDQUFDLGVBQWUsQ0FBQyxLQUFLLENBQUMsV0FBVyxFQUFFLENBQUMsQ0FBQyxFQUFFO1lBQ2pGLE1BQU0sT0FBTyxHQUFHLElBQUksQ0FBQyxzQkFBc0IsQ0FBQyxLQUFLLENBQUMsV0FBVyxFQUFFLFVBQVUsQ0FBQyxDQUFDO1lBQzNFLE9BQU8sQ0FBQyxNQUFNLEtBQUssQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUM7U0FDekQ7UUFDRCxPQUFPLElBQUksQ0FBQztJQUNkLENBQUM7Q0FDRjtBQUVEOzs7R0FHRztBQUNILFNBQVMsYUFBYSxDQUNwQixPQUFVO0lBRVYsTUFBTSxVQUFVLEdBQUcsRUFBRSxDQUFDO0lBQ3RCLE1BQU0sY0FBYyxHQUFHLEVBQUUsQ0FBQztJQUMxQixNQUFNLGNBQWMsR0FBRyxFQUFFLENBQUM7SUFDMUIsTUFBTSxZQUFZLEdBQUcsSUFBSSxHQUFHLEVBRXpCLENBQUM7SUFFSixLQUFLLE1BQU0sS0FBSyxJQUFJLE9BQU8sRUFBRTtRQUMzQixJQUFJLE9BQU8sS0FBSyxLQUFLLFFBQVEsRUFBRTtZQUM3QixVQUFVLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQ3ZCLGNBQWMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7U0FDNUI7YUFBTTtZQUNMLE1BQU0sU0FBUyxHQUFHLEtBQUssWUFBWSxnQkFBZ0IsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxJQUFJLGdCQUFnQixDQUFDLEtBQUssRUFBRSxFQUFFLENBQUMsQ0FBQztZQUM5RixVQUFVLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1lBQzNCLGNBQWMsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7WUFDL0IsWUFBWSxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsV0FBVyxDQUFDLENBQUM7U0FDekM7S0FDRjtJQUVELE9BQU8sRUFBQyxVQUFVLEVBQUUsY0FBYyxFQUFFLGNBQWMsRUFBRSxZQUFZLEVBQUMsQ0FBQztBQUNwRSxDQUFDO0FBRUQ7OztHQUdHO0FBQ0gsS0FBSyxVQUFVLDRCQUE0QixDQUN6QyxPQUFVO0lBRVYsSUFBSSxrQkFBa0IsR0FBRyxLQUFLLENBQUM7SUFDL0IsSUFBSSxtQkFBbUIsR0FBRyxJQUFJLEdBQUcsRUFBRSxDQUFDO0lBQ3BDLE1BQU0sY0FBYyxHQUFHLEVBQUUsQ0FBQztJQUMxQixLQUFLLE1BQU0sTUFBTSxJQUFJLE9BQU8sRUFBRTtRQUM1QixJQUFJLENBQUMsTUFBTSxFQUFFO1lBQ1gsU0FBUztTQUNWO1FBQ0QsSUFBSSxNQUFNLFlBQVksZ0JBQWdCLEVBQUU7WUFDdEMsSUFBSSxDQUFDLG1CQUFtQixDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsV0FBVyxDQUFDLEVBQUU7Z0JBQ2hELG1CQUFtQixDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsV0FBVyxDQUFDLENBQUM7Z0JBQzVDLGNBQWMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7YUFDN0I7U0FDRjthQUFNLElBQUksQ0FBQyxrQkFBa0IsRUFBRTtZQUM5QixrQkFBa0IsR0FBRyxJQUFJLENBQUM7WUFDMUIsY0FBYyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztTQUM3QjtLQUNGO0lBQ0QsT0FBTyxjQUFtQixDQUFDO0FBQzdCLENBQUM7QUFFRCw4REFBOEQ7QUFDOUQsS0FBSyxVQUFVLGtCQUFrQixDQUMvQixPQUFxQixFQUNyQixpQkFBMkI7SUFFM0IsTUFBTSxNQUFNLEdBQUcsQ0FBQyxNQUFNLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ2xDLElBQUksTUFBTSxJQUFJLFNBQVMsRUFBRTtRQUN2QixNQUFNLEtBQUssQ0FDVCxpRUFBaUU7WUFDL0QsaUJBQWlCLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsSUFBSSxJQUFJLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FDekQsQ0FBQztLQUNIO0lBQ0QsT0FBTyxNQUFNLENBQUM7QUFDaEIsQ0FBQztBQUVELGlFQUFpRTtBQUNqRSxTQUFTLG1DQUFtQyxDQUFDLE9BQXVDO0lBQ2xGLE9BQU8sT0FBTyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUN6QixPQUFPLEtBQUssS0FBSyxRQUFRO1FBQ3ZCLENBQUMsQ0FBQyxrQ0FBa0MsQ0FBQyxLQUFLLENBQUM7UUFDM0MsQ0FBQyxDQUFDLHVDQUF1QyxDQUFDLEtBQUssQ0FBQyxDQUNuRCxDQUFDO0FBQ0osQ0FBQztBQUVELGdFQUFnRTtBQUNoRSxTQUFTLHVDQUF1QyxDQUFDLEtBQXdCO0lBQ3ZFLE1BQU0sZ0JBQWdCLEdBQ3BCLEtBQUssWUFBWSxnQkFBZ0IsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxJQUFJLGdCQUFnQixDQUFDLEtBQUssRUFBRSxFQUFFLENBQUMsQ0FBQztJQUM5RSxNQUFNLEVBQUMsSUFBSSxFQUFFLFlBQVksRUFBQyxHQUFHLGdCQUFnQixDQUFDLFdBQVcsQ0FBQztJQUMxRCxNQUFNLFdBQVcsR0FBRyxHQUFHLElBQUksMENBQTBDLFlBQVksR0FBRyxDQUFDO0lBQ3JGLE1BQU0sV0FBVyxHQUFHLGdCQUFnQixDQUFDLGNBQWMsRUFBRSxDQUFDO0lBQ3RELE9BQU8sQ0FDTCxXQUFXO1FBQ1gsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLGdDQUFnQyxnQkFBZ0IsQ0FBQyxjQUFjLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FDekYsQ0FBQztBQUNKLENBQUM7QUFFRCwyREFBMkQ7QUFDM0QsU0FBUyxrQ0FBa0MsQ0FBQyxRQUFnQjtJQUMxRCxPQUFPLCtDQUErQyxRQUFRLEdBQUcsQ0FBQztBQUNwRSxDQUFDO0FBRUQsNkRBQTZEO0FBQzdELFNBQVMsb0NBQW9DLENBQUMsUUFBZ0I7SUFDNUQsT0FBTyxpREFBaUQsUUFBUSxHQUFHLENBQUM7QUFDdEUsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge3BhcmFsbGVsfSBmcm9tICcuL2NoYW5nZS1kZXRlY3Rpb24nO1xuaW1wb3J0IHtcbiAgQXN5bmNGYWN0b3J5Rm4sXG4gIENvbXBvbmVudEhhcm5lc3MsXG4gIENvbXBvbmVudEhhcm5lc3NDb25zdHJ1Y3RvcixcbiAgSGFybmVzc0xvYWRlcixcbiAgSGFybmVzc1ByZWRpY2F0ZSxcbiAgSGFybmVzc1F1ZXJ5LFxuICBMb2NhdG9yRmFjdG9yeSxcbiAgTG9jYXRvckZuUmVzdWx0LFxufSBmcm9tICcuL2NvbXBvbmVudC1oYXJuZXNzJztcbmltcG9ydCB7VGVzdEVsZW1lbnR9IGZyb20gJy4vdGVzdC1lbGVtZW50JztcblxuLyoqIFBhcnNlZCBmb3JtIG9mIHRoZSBxdWVyaWVzIHBhc3NlZCB0byB0aGUgYGxvY2F0b3JGb3IqYCBtZXRob2RzLiAqL1xudHlwZSBQYXJzZWRRdWVyaWVzPFQgZXh0ZW5kcyBDb21wb25lbnRIYXJuZXNzPiA9IHtcbiAgLyoqIFRoZSBmdWxsIGxpc3Qgb2YgcXVlcmllcywgaW4gdGhlaXIgb3JpZ2luYWwgb3JkZXIuICovXG4gIGFsbFF1ZXJpZXM6IChzdHJpbmcgfCBIYXJuZXNzUHJlZGljYXRlPFQ+KVtdO1xuICAvKipcbiAgICogQSBmaWx0ZXJlZCB2aWV3IG9mIGBhbGxRdWVyaWVzYCBjb250YWluaW5nIG9ubHkgdGhlIHF1ZXJpZXMgdGhhdCBhcmUgbG9va2luZyBmb3IgYVxuICAgKiBgQ29tcG9uZW50SGFybmVzc2BcbiAgICovXG4gIGhhcm5lc3NRdWVyaWVzOiBIYXJuZXNzUHJlZGljYXRlPFQ+W107XG4gIC8qKlxuICAgKiBBIGZpbHRlcmVkIHZpZXcgb2YgYGFsbFF1ZXJpZXNgIGNvbnRhaW5pbmcgb25seSB0aGUgcXVlcmllcyB0aGF0IGFyZSBsb29raW5nIGZvciBhXG4gICAqIGBUZXN0RWxlbWVudGBcbiAgICovXG4gIGVsZW1lbnRRdWVyaWVzOiBzdHJpbmdbXTtcbiAgLyoqIFRoZSBzZXQgb2YgYWxsIGBDb21wb25lbnRIYXJuZXNzYCBzdWJjbGFzc2VzIHJlcHJlc2VudGVkIGluIHRoZSBvcmlnaW5hbCBxdWVyeSBsaXN0LiAqL1xuICBoYXJuZXNzVHlwZXM6IFNldDxDb21wb25lbnRIYXJuZXNzQ29uc3RydWN0b3I8VD4+O1xufTtcblxuLyoqXG4gKiBCYXNlIGhhcm5lc3MgZW52aXJvbm1lbnQgY2xhc3MgdGhhdCBjYW4gYmUgZXh0ZW5kZWQgdG8gYWxsb3cgYENvbXBvbmVudEhhcm5lc3NgZXMgdG8gYmUgdXNlZCBpblxuICogZGlmZmVyZW50IHRlc3QgZW52aXJvbm1lbnRzIChlLmcuIHRlc3RiZWQsIHByb3RyYWN0b3IsIGV0Yy4pLiBUaGlzIGNsYXNzIGltcGxlbWVudHMgdGhlXG4gKiBmdW5jdGlvbmFsaXR5IG9mIGJvdGggYSBgSGFybmVzc0xvYWRlcmAgYW5kIGBMb2NhdG9yRmFjdG9yeWAuIFRoaXMgY2xhc3MgaXMgZ2VuZXJpYyBvbiB0aGUgcmF3XG4gKiBlbGVtZW50IHR5cGUsIGBFYCwgdXNlZCBieSB0aGUgcGFydGljdWxhciB0ZXN0IGVudmlyb25tZW50LlxuICovXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgSGFybmVzc0Vudmlyb25tZW50PEU+IGltcGxlbWVudHMgSGFybmVzc0xvYWRlciwgTG9jYXRvckZhY3Rvcnkge1xuICAvLyBJbXBsZW1lbnRlZCBhcyBwYXJ0IG9mIHRoZSBgTG9jYXRvckZhY3RvcnlgIGludGVyZmFjZS5cbiAgZ2V0IHJvb3RFbGVtZW50KCk6IFRlc3RFbGVtZW50IHtcbiAgICB0aGlzLl9yb290RWxlbWVudCA9IHRoaXMuX3Jvb3RFbGVtZW50IHx8IHRoaXMuY3JlYXRlVGVzdEVsZW1lbnQodGhpcy5yYXdSb290RWxlbWVudCk7XG4gICAgcmV0dXJuIHRoaXMuX3Jvb3RFbGVtZW50O1xuICB9XG4gIHNldCByb290RWxlbWVudChlbGVtZW50OiBUZXN0RWxlbWVudCkge1xuICAgIHRoaXMuX3Jvb3RFbGVtZW50ID0gZWxlbWVudDtcbiAgfVxuICBwcml2YXRlIF9yb290RWxlbWVudDogVGVzdEVsZW1lbnQgfCB1bmRlZmluZWQ7XG5cbiAgcHJvdGVjdGVkIGNvbnN0cnVjdG9yKHByb3RlY3RlZCByYXdSb290RWxlbWVudDogRSkge31cblxuICAvLyBJbXBsZW1lbnRlZCBhcyBwYXJ0IG9mIHRoZSBgTG9jYXRvckZhY3RvcnlgIGludGVyZmFjZS5cbiAgZG9jdW1lbnRSb290TG9jYXRvckZhY3RvcnkoKTogTG9jYXRvckZhY3Rvcnkge1xuICAgIHJldHVybiB0aGlzLmNyZWF0ZUVudmlyb25tZW50KHRoaXMuZ2V0RG9jdW1lbnRSb290KCkpO1xuICB9XG5cbiAgLy8gSW1wbGVtZW50ZWQgYXMgcGFydCBvZiB0aGUgYExvY2F0b3JGYWN0b3J5YCBpbnRlcmZhY2UuXG4gIGxvY2F0b3JGb3I8VCBleHRlbmRzIChIYXJuZXNzUXVlcnk8YW55PiB8IHN0cmluZylbXT4oXG4gICAgLi4ucXVlcmllczogVFxuICApOiBBc3luY0ZhY3RvcnlGbjxMb2NhdG9yRm5SZXN1bHQ8VD4+IHtcbiAgICByZXR1cm4gKCkgPT5cbiAgICAgIF9hc3NlcnRSZXN1bHRGb3VuZChcbiAgICAgICAgdGhpcy5fZ2V0QWxsSGFybmVzc2VzQW5kVGVzdEVsZW1lbnRzKHF1ZXJpZXMpLFxuICAgICAgICBfZ2V0RGVzY3JpcHRpb25Gb3JMb2NhdG9yRm9yUXVlcmllcyhxdWVyaWVzKSxcbiAgICAgICk7XG4gIH1cblxuICAvLyBJbXBsZW1lbnRlZCBhcyBwYXJ0IG9mIHRoZSBgTG9jYXRvckZhY3RvcnlgIGludGVyZmFjZS5cbiAgbG9jYXRvckZvck9wdGlvbmFsPFQgZXh0ZW5kcyAoSGFybmVzc1F1ZXJ5PGFueT4gfCBzdHJpbmcpW10+KFxuICAgIC4uLnF1ZXJpZXM6IFRcbiAgKTogQXN5bmNGYWN0b3J5Rm48TG9jYXRvckZuUmVzdWx0PFQ+IHwgbnVsbD4ge1xuICAgIHJldHVybiBhc3luYyAoKSA9PiAoYXdhaXQgdGhpcy5fZ2V0QWxsSGFybmVzc2VzQW5kVGVzdEVsZW1lbnRzKHF1ZXJpZXMpKVswXSB8fCBudWxsO1xuICB9XG5cbiAgLy8gSW1wbGVtZW50ZWQgYXMgcGFydCBvZiB0aGUgYExvY2F0b3JGYWN0b3J5YCBpbnRlcmZhY2UuXG4gIGxvY2F0b3JGb3JBbGw8VCBleHRlbmRzIChIYXJuZXNzUXVlcnk8YW55PiB8IHN0cmluZylbXT4oXG4gICAgLi4ucXVlcmllczogVFxuICApOiBBc3luY0ZhY3RvcnlGbjxMb2NhdG9yRm5SZXN1bHQ8VD5bXT4ge1xuICAgIHJldHVybiAoKSA9PiB0aGlzLl9nZXRBbGxIYXJuZXNzZXNBbmRUZXN0RWxlbWVudHMocXVlcmllcyk7XG4gIH1cblxuICAvLyBJbXBsZW1lbnRlZCBhcyBwYXJ0IG9mIHRoZSBgTG9jYXRvckZhY3RvcnlgIGludGVyZmFjZS5cbiAgYXN5bmMgcm9vdEhhcm5lc3NMb2FkZXIoKTogUHJvbWlzZTxIYXJuZXNzTG9hZGVyPiB7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICAvLyBJbXBsZW1lbnRlZCBhcyBwYXJ0IG9mIHRoZSBgTG9jYXRvckZhY3RvcnlgIGludGVyZmFjZS5cbiAgYXN5bmMgaGFybmVzc0xvYWRlckZvcihzZWxlY3Rvcjogc3RyaW5nKTogUHJvbWlzZTxIYXJuZXNzTG9hZGVyPiB7XG4gICAgcmV0dXJuIHRoaXMuY3JlYXRlRW52aXJvbm1lbnQoXG4gICAgICBhd2FpdCBfYXNzZXJ0UmVzdWx0Rm91bmQodGhpcy5nZXRBbGxSYXdFbGVtZW50cyhzZWxlY3RvciksIFtcbiAgICAgICAgX2dldERlc2NyaXB0aW9uRm9ySGFybmVzc0xvYWRlclF1ZXJ5KHNlbGVjdG9yKSxcbiAgICAgIF0pLFxuICAgICk7XG4gIH1cblxuICAvLyBJbXBsZW1lbnRlZCBhcyBwYXJ0IG9mIHRoZSBgTG9jYXRvckZhY3RvcnlgIGludGVyZmFjZS5cbiAgYXN5bmMgaGFybmVzc0xvYWRlckZvck9wdGlvbmFsKHNlbGVjdG9yOiBzdHJpbmcpOiBQcm9taXNlPEhhcm5lc3NMb2FkZXIgfCBudWxsPiB7XG4gICAgY29uc3QgZWxlbWVudHMgPSBhd2FpdCB0aGlzLmdldEFsbFJhd0VsZW1lbnRzKHNlbGVjdG9yKTtcbiAgICByZXR1cm4gZWxlbWVudHNbMF0gPyB0aGlzLmNyZWF0ZUVudmlyb25tZW50KGVsZW1lbnRzWzBdKSA6IG51bGw7XG4gIH1cblxuICAvLyBJbXBsZW1lbnRlZCBhcyBwYXJ0IG9mIHRoZSBgTG9jYXRvckZhY3RvcnlgIGludGVyZmFjZS5cbiAgYXN5bmMgaGFybmVzc0xvYWRlckZvckFsbChzZWxlY3Rvcjogc3RyaW5nKTogUHJvbWlzZTxIYXJuZXNzTG9hZGVyW10+IHtcbiAgICBjb25zdCBlbGVtZW50cyA9IGF3YWl0IHRoaXMuZ2V0QWxsUmF3RWxlbWVudHMoc2VsZWN0b3IpO1xuICAgIHJldHVybiBlbGVtZW50cy5tYXAoZWxlbWVudCA9PiB0aGlzLmNyZWF0ZUVudmlyb25tZW50KGVsZW1lbnQpKTtcbiAgfVxuXG4gIC8vIEltcGxlbWVudGVkIGFzIHBhcnQgb2YgdGhlIGBIYXJuZXNzTG9hZGVyYCBpbnRlcmZhY2UuXG4gIGdldEhhcm5lc3M8VCBleHRlbmRzIENvbXBvbmVudEhhcm5lc3M+KHF1ZXJ5OiBIYXJuZXNzUXVlcnk8VD4pOiBQcm9taXNlPFQ+IHtcbiAgICByZXR1cm4gdGhpcy5sb2NhdG9yRm9yKHF1ZXJ5KSgpO1xuICB9XG5cbiAgLy8gSW1wbGVtZW50ZWQgYXMgcGFydCBvZiB0aGUgYEhhcm5lc3NMb2FkZXJgIGludGVyZmFjZS5cbiAgZ2V0QWxsSGFybmVzc2VzPFQgZXh0ZW5kcyBDb21wb25lbnRIYXJuZXNzPihxdWVyeTogSGFybmVzc1F1ZXJ5PFQ+KTogUHJvbWlzZTxUW10+IHtcbiAgICByZXR1cm4gdGhpcy5sb2NhdG9yRm9yQWxsKHF1ZXJ5KSgpO1xuICB9XG5cbiAgLy8gSW1wbGVtZW50ZWQgYXMgcGFydCBvZiB0aGUgYEhhcm5lc3NMb2FkZXJgIGludGVyZmFjZS5cbiAgYXN5bmMgZ2V0Q2hpbGRMb2FkZXIoc2VsZWN0b3I6IHN0cmluZyk6IFByb21pc2U8SGFybmVzc0xvYWRlcj4ge1xuICAgIHJldHVybiB0aGlzLmNyZWF0ZUVudmlyb25tZW50KFxuICAgICAgYXdhaXQgX2Fzc2VydFJlc3VsdEZvdW5kKHRoaXMuZ2V0QWxsUmF3RWxlbWVudHMoc2VsZWN0b3IpLCBbXG4gICAgICAgIF9nZXREZXNjcmlwdGlvbkZvckhhcm5lc3NMb2FkZXJRdWVyeShzZWxlY3RvciksXG4gICAgICBdKSxcbiAgICApO1xuICB9XG5cbiAgLy8gSW1wbGVtZW50ZWQgYXMgcGFydCBvZiB0aGUgYEhhcm5lc3NMb2FkZXJgIGludGVyZmFjZS5cbiAgYXN5bmMgZ2V0QWxsQ2hpbGRMb2FkZXJzKHNlbGVjdG9yOiBzdHJpbmcpOiBQcm9taXNlPEhhcm5lc3NMb2FkZXJbXT4ge1xuICAgIHJldHVybiAoYXdhaXQgdGhpcy5nZXRBbGxSYXdFbGVtZW50cyhzZWxlY3RvcikpLm1hcChlID0+IHRoaXMuY3JlYXRlRW52aXJvbm1lbnQoZSkpO1xuICB9XG5cbiAgLyoqIENyZWF0ZXMgYSBgQ29tcG9uZW50SGFybmVzc2AgZm9yIHRoZSBnaXZlbiBoYXJuZXNzIHR5cGUgd2l0aCB0aGUgZ2l2ZW4gcmF3IGhvc3QgZWxlbWVudC4gKi9cbiAgcHJvdGVjdGVkIGNyZWF0ZUNvbXBvbmVudEhhcm5lc3M8VCBleHRlbmRzIENvbXBvbmVudEhhcm5lc3M+KFxuICAgIGhhcm5lc3NUeXBlOiBDb21wb25lbnRIYXJuZXNzQ29uc3RydWN0b3I8VD4sXG4gICAgZWxlbWVudDogRSxcbiAgKTogVCB7XG4gICAgcmV0dXJuIG5ldyBoYXJuZXNzVHlwZSh0aGlzLmNyZWF0ZUVudmlyb25tZW50KGVsZW1lbnQpKTtcbiAgfVxuXG4gIC8vIFBhcnQgb2YgTG9jYXRvckZhY3RvcnkgaW50ZXJmYWNlLCBzdWJjbGFzc2VzIHdpbGwgaW1wbGVtZW50LlxuICBhYnN0cmFjdCBmb3JjZVN0YWJpbGl6ZSgpOiBQcm9taXNlPHZvaWQ+O1xuXG4gIC8vIFBhcnQgb2YgTG9jYXRvckZhY3RvcnkgaW50ZXJmYWNlLCBzdWJjbGFzc2VzIHdpbGwgaW1wbGVtZW50LlxuICBhYnN0cmFjdCB3YWl0Rm9yVGFza3NPdXRzaWRlQW5ndWxhcigpOiBQcm9taXNlPHZvaWQ+O1xuXG4gIC8qKiBHZXRzIHRoZSByb290IGVsZW1lbnQgZm9yIHRoZSBkb2N1bWVudC4gKi9cbiAgcHJvdGVjdGVkIGFic3RyYWN0IGdldERvY3VtZW50Um9vdCgpOiBFO1xuXG4gIC8qKiBDcmVhdGVzIGEgYFRlc3RFbGVtZW50YCBmcm9tIGEgcmF3IGVsZW1lbnQuICovXG4gIHByb3RlY3RlZCBhYnN0cmFjdCBjcmVhdGVUZXN0RWxlbWVudChlbGVtZW50OiBFKTogVGVzdEVsZW1lbnQ7XG5cbiAgLyoqIENyZWF0ZXMgYSBgSGFybmVzc0xvYWRlcmAgcm9vdGVkIGF0IHRoZSBnaXZlbiByYXcgZWxlbWVudC4gKi9cbiAgcHJvdGVjdGVkIGFic3RyYWN0IGNyZWF0ZUVudmlyb25tZW50KGVsZW1lbnQ6IEUpOiBIYXJuZXNzRW52aXJvbm1lbnQ8RT47XG5cbiAgLyoqXG4gICAqIEdldHMgYSBsaXN0IG9mIGFsbCBlbGVtZW50cyBtYXRjaGluZyB0aGUgZ2l2ZW4gc2VsZWN0b3IgdW5kZXIgdGhpcyBlbnZpcm9ubWVudCdzIHJvb3QgZWxlbWVudC5cbiAgICovXG4gIHByb3RlY3RlZCBhYnN0cmFjdCBnZXRBbGxSYXdFbGVtZW50cyhzZWxlY3Rvcjogc3RyaW5nKTogUHJvbWlzZTxFW10+O1xuXG4gIC8qKlxuICAgKiBNYXRjaGVzIHRoZSBnaXZlbiByYXcgZWxlbWVudHMgd2l0aCB0aGUgZ2l2ZW4gbGlzdCBvZiBlbGVtZW50IGFuZCBoYXJuZXNzIHF1ZXJpZXMgdG8gcHJvZHVjZSBhXG4gICAqIGxpc3Qgb2YgbWF0Y2hlZCBoYXJuZXNzZXMgYW5kIHRlc3QgZWxlbWVudHMuXG4gICAqL1xuICBwcml2YXRlIGFzeW5jIF9nZXRBbGxIYXJuZXNzZXNBbmRUZXN0RWxlbWVudHM8VCBleHRlbmRzIChIYXJuZXNzUXVlcnk8YW55PiB8IHN0cmluZylbXT4oXG4gICAgcXVlcmllczogVCxcbiAgKTogUHJvbWlzZTxMb2NhdG9yRm5SZXN1bHQ8VD5bXT4ge1xuICAgIGlmICghcXVlcmllcy5sZW5ndGgpIHtcbiAgICAgIHRocm93IEVycm9yKCdDREsgQ29tcG9uZW50IGhhcm5lc3MgcXVlcnkgbXVzdCBjb250YWluIGF0IGxlYXN0IG9uZSBlbGVtZW50LicpO1xuICAgIH1cblxuICAgIGNvbnN0IHthbGxRdWVyaWVzLCBoYXJuZXNzUXVlcmllcywgZWxlbWVudFF1ZXJpZXMsIGhhcm5lc3NUeXBlc30gPSBfcGFyc2VRdWVyaWVzKHF1ZXJpZXMpO1xuXG4gICAgLy8gQ29tYmluZSBhbGwgb2YgdGhlIHF1ZXJpZXMgaW50byBvbmUgbGFyZ2UgY29tbWEtZGVsaW1pdGVkIHNlbGVjdG9yIGFuZCB1c2UgaXQgdG8gZ2V0IGFsbCByYXdcbiAgICAvLyBlbGVtZW50cyBtYXRjaGluZyBhbnkgb2YgdGhlIGluZGl2aWR1YWwgcXVlcmllcy5cbiAgICBjb25zdCByYXdFbGVtZW50cyA9IGF3YWl0IHRoaXMuZ2V0QWxsUmF3RWxlbWVudHMoXG4gICAgICBbLi4uZWxlbWVudFF1ZXJpZXMsIC4uLmhhcm5lc3NRdWVyaWVzLm1hcChwcmVkaWNhdGUgPT4gcHJlZGljYXRlLmdldFNlbGVjdG9yKCkpXS5qb2luKCcsJyksXG4gICAgKTtcblxuICAgIC8vIElmIGV2ZXJ5IHF1ZXJ5IGlzIHNlYXJjaGluZyBmb3IgdGhlIHNhbWUgaGFybmVzcyBzdWJjbGFzcywgd2Uga25vdyBldmVyeSByZXN1bHQgY29ycmVzcG9uZHNcbiAgICAvLyB0byBhbiBpbnN0YW5jZSBvZiB0aGF0IHN1YmNsYXNzLiBMaWtld2lzZSwgaWYgZXZlcnkgcXVlcnkgaXMgZm9yIGEgYFRlc3RFbGVtZW50YCwgd2Uga25vd1xuICAgIC8vIGV2ZXJ5IHJlc3VsdCBjb3JyZXNwb25kcyB0byBhIGBUZXN0RWxlbWVudGAuIE90aGVyd2lzZSB3ZSBuZWVkIHRvIHZlcmlmeSB3aGljaCByZXN1bHQgd2FzXG4gICAgLy8gZm91bmQgYnkgd2hpY2ggc2VsZWN0b3Igc28gaXQgY2FuIGJlIG1hdGNoZWQgdG8gdGhlIGFwcHJvcHJpYXRlIGluc3RhbmNlLlxuICAgIGNvbnN0IHNraXBTZWxlY3RvckNoZWNrID1cbiAgICAgIChlbGVtZW50UXVlcmllcy5sZW5ndGggPT09IDAgJiYgaGFybmVzc1R5cGVzLnNpemUgPT09IDEpIHx8IGhhcm5lc3NRdWVyaWVzLmxlbmd0aCA9PT0gMDtcblxuICAgIGNvbnN0IHBlckVsZW1lbnRNYXRjaGVzID0gYXdhaXQgcGFyYWxsZWwoKCkgPT5cbiAgICAgIHJhd0VsZW1lbnRzLm1hcChhc3luYyByYXdFbGVtZW50ID0+IHtcbiAgICAgICAgY29uc3QgdGVzdEVsZW1lbnQgPSB0aGlzLmNyZWF0ZVRlc3RFbGVtZW50KHJhd0VsZW1lbnQpO1xuICAgICAgICBjb25zdCBhbGxSZXN1bHRzRm9yRWxlbWVudCA9IGF3YWl0IHBhcmFsbGVsKFxuICAgICAgICAgIC8vIEZvciBlYWNoIHF1ZXJ5LCBnZXQgYG51bGxgIGlmIGl0IGRvZXNuJ3QgbWF0Y2gsIG9yIGEgYFRlc3RFbGVtZW50YCBvclxuICAgICAgICAgIC8vIGBDb21wb25lbnRIYXJuZXNzYCBhcyBhcHByb3ByaWF0ZSBpZiBpdCBkb2VzIG1hdGNoLiBUaGlzIGdpdmVzIHVzIGV2ZXJ5dGhpbmcgdGhhdFxuICAgICAgICAgIC8vIG1hdGNoZXMgdGhlIGN1cnJlbnQgcmF3IGVsZW1lbnQsIGJ1dCBpdCBtYXkgY29udGFpbiBkdXBsaWNhdGUgZW50cmllcyAoZS5nLlxuICAgICAgICAgIC8vIG11bHRpcGxlIGBUZXN0RWxlbWVudGAgb3IgbXVsdGlwbGUgYENvbXBvbmVudEhhcm5lc3NgIG9mIHRoZSBzYW1lIHR5cGUpLlxuICAgICAgICAgICgpID0+XG4gICAgICAgICAgICBhbGxRdWVyaWVzLm1hcChxdWVyeSA9PlxuICAgICAgICAgICAgICB0aGlzLl9nZXRRdWVyeVJlc3VsdEZvckVsZW1lbnQocXVlcnksIHJhd0VsZW1lbnQsIHRlc3RFbGVtZW50LCBza2lwU2VsZWN0b3JDaGVjayksXG4gICAgICAgICAgICApLFxuICAgICAgICApO1xuICAgICAgICByZXR1cm4gX3JlbW92ZUR1cGxpY2F0ZVF1ZXJ5UmVzdWx0cyhhbGxSZXN1bHRzRm9yRWxlbWVudCk7XG4gICAgICB9KSxcbiAgICApO1xuICAgIHJldHVybiAoW10gYXMgYW55KS5jb25jYXQoLi4ucGVyRWxlbWVudE1hdGNoZXMpO1xuICB9XG5cbiAgLyoqXG4gICAqIENoZWNrIHdoZXRoZXIgdGhlIGdpdmVuIHF1ZXJ5IG1hdGNoZXMgdGhlIGdpdmVuIGVsZW1lbnQsIGlmIGl0IGRvZXMgcmV0dXJuIHRoZSBtYXRjaGVkXG4gICAqIGBUZXN0RWxlbWVudGAgb3IgYENvbXBvbmVudEhhcm5lc3NgLCBpZiBpdCBkb2VzIG5vdCwgcmV0dXJuIG51bGwuIEluIGNhc2VzIHdoZXJlIHRoZSBjYWxsZXJcbiAgICoga25vd3MgZm9yIHN1cmUgdGhhdCB0aGUgcXVlcnkgbWF0Y2hlcyB0aGUgZWxlbWVudCdzIHNlbGVjdG9yLCBgc2tpcFNlbGVjdG9yQ2hlY2tgIGNhbiBiZSB1c2VkXG4gICAqIHRvIHNraXAgdmVyaWZpY2F0aW9uIGFuZCBvcHRpbWl6ZSBwZXJmb3JtYW5jZS5cbiAgICovXG4gIHByaXZhdGUgYXN5bmMgX2dldFF1ZXJ5UmVzdWx0Rm9yRWxlbWVudDxUIGV4dGVuZHMgQ29tcG9uZW50SGFybmVzcz4oXG4gICAgcXVlcnk6IHN0cmluZyB8IEhhcm5lc3NQcmVkaWNhdGU8VD4sXG4gICAgcmF3RWxlbWVudDogRSxcbiAgICB0ZXN0RWxlbWVudDogVGVzdEVsZW1lbnQsXG4gICAgc2tpcFNlbGVjdG9yQ2hlY2s6IGJvb2xlYW4gPSBmYWxzZSxcbiAgKTogUHJvbWlzZTxUIHwgVGVzdEVsZW1lbnQgfCBudWxsPiB7XG4gICAgaWYgKHR5cGVvZiBxdWVyeSA9PT0gJ3N0cmluZycpIHtcbiAgICAgIHJldHVybiBza2lwU2VsZWN0b3JDaGVjayB8fCAoYXdhaXQgdGVzdEVsZW1lbnQubWF0Y2hlc1NlbGVjdG9yKHF1ZXJ5KSkgPyB0ZXN0RWxlbWVudCA6IG51bGw7XG4gICAgfVxuICAgIGlmIChza2lwU2VsZWN0b3JDaGVjayB8fCAoYXdhaXQgdGVzdEVsZW1lbnQubWF0Y2hlc1NlbGVjdG9yKHF1ZXJ5LmdldFNlbGVjdG9yKCkpKSkge1xuICAgICAgY29uc3QgaGFybmVzcyA9IHRoaXMuY3JlYXRlQ29tcG9uZW50SGFybmVzcyhxdWVyeS5oYXJuZXNzVHlwZSwgcmF3RWxlbWVudCk7XG4gICAgICByZXR1cm4gKGF3YWl0IHF1ZXJ5LmV2YWx1YXRlKGhhcm5lc3MpKSA/IGhhcm5lc3MgOiBudWxsO1xuICAgIH1cbiAgICByZXR1cm4gbnVsbDtcbiAgfVxufVxuXG4vKipcbiAqIFBhcnNlcyBhIGxpc3Qgb2YgcXVlcmllcyBpbiB0aGUgZm9ybWF0IGFjY2VwdGVkIGJ5IHRoZSBgbG9jYXRvckZvcipgIG1ldGhvZHMgaW50byBhbiBlYXNpZXIgdG9cbiAqIHdvcmsgd2l0aCBmb3JtYXQuXG4gKi9cbmZ1bmN0aW9uIF9wYXJzZVF1ZXJpZXM8VCBleHRlbmRzIChIYXJuZXNzUXVlcnk8YW55PiB8IHN0cmluZylbXT4oXG4gIHF1ZXJpZXM6IFQsXG4pOiBQYXJzZWRRdWVyaWVzPExvY2F0b3JGblJlc3VsdDxUPiAmIENvbXBvbmVudEhhcm5lc3M+IHtcbiAgY29uc3QgYWxsUXVlcmllcyA9IFtdO1xuICBjb25zdCBoYXJuZXNzUXVlcmllcyA9IFtdO1xuICBjb25zdCBlbGVtZW50UXVlcmllcyA9IFtdO1xuICBjb25zdCBoYXJuZXNzVHlwZXMgPSBuZXcgU2V0PFxuICAgIENvbXBvbmVudEhhcm5lc3NDb25zdHJ1Y3RvcjxMb2NhdG9yRm5SZXN1bHQ8VD4gJiBDb21wb25lbnRIYXJuZXNzPlxuICA+KCk7XG5cbiAgZm9yIChjb25zdCBxdWVyeSBvZiBxdWVyaWVzKSB7XG4gICAgaWYgKHR5cGVvZiBxdWVyeSA9PT0gJ3N0cmluZycpIHtcbiAgICAgIGFsbFF1ZXJpZXMucHVzaChxdWVyeSk7XG4gICAgICBlbGVtZW50UXVlcmllcy5wdXNoKHF1ZXJ5KTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc3QgcHJlZGljYXRlID0gcXVlcnkgaW5zdGFuY2VvZiBIYXJuZXNzUHJlZGljYXRlID8gcXVlcnkgOiBuZXcgSGFybmVzc1ByZWRpY2F0ZShxdWVyeSwge30pO1xuICAgICAgYWxsUXVlcmllcy5wdXNoKHByZWRpY2F0ZSk7XG4gICAgICBoYXJuZXNzUXVlcmllcy5wdXNoKHByZWRpY2F0ZSk7XG4gICAgICBoYXJuZXNzVHlwZXMuYWRkKHByZWRpY2F0ZS5oYXJuZXNzVHlwZSk7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHthbGxRdWVyaWVzLCBoYXJuZXNzUXVlcmllcywgZWxlbWVudFF1ZXJpZXMsIGhhcm5lc3NUeXBlc307XG59XG5cbi8qKlxuICogUmVtb3ZlcyBkdXBsaWNhdGUgcXVlcnkgcmVzdWx0cyBmb3IgYSBwYXJ0aWN1bGFyIGVsZW1lbnQuIChlLmcuIG11bHRpcGxlIGBUZXN0RWxlbWVudGBcbiAqIGluc3RhbmNlcyBvciBtdWx0aXBsZSBpbnN0YW5jZXMgb2YgdGhlIHNhbWUgYENvbXBvbmVudEhhcm5lc3NgIGNsYXNzLlxuICovXG5hc3luYyBmdW5jdGlvbiBfcmVtb3ZlRHVwbGljYXRlUXVlcnlSZXN1bHRzPFQgZXh0ZW5kcyAoQ29tcG9uZW50SGFybmVzcyB8IFRlc3RFbGVtZW50IHwgbnVsbClbXT4oXG4gIHJlc3VsdHM6IFQsXG4pOiBQcm9taXNlPFQ+IHtcbiAgbGV0IHRlc3RFbGVtZW50TWF0Y2hlZCA9IGZhbHNlO1xuICBsZXQgbWF0Y2hlZEhhcm5lc3NUeXBlcyA9IG5ldyBTZXQoKTtcbiAgY29uc3QgZGVkdXBlZE1hdGNoZXMgPSBbXTtcbiAgZm9yIChjb25zdCByZXN1bHQgb2YgcmVzdWx0cykge1xuICAgIGlmICghcmVzdWx0KSB7XG4gICAgICBjb250aW51ZTtcbiAgICB9XG4gICAgaWYgKHJlc3VsdCBpbnN0YW5jZW9mIENvbXBvbmVudEhhcm5lc3MpIHtcbiAgICAgIGlmICghbWF0Y2hlZEhhcm5lc3NUeXBlcy5oYXMocmVzdWx0LmNvbnN0cnVjdG9yKSkge1xuICAgICAgICBtYXRjaGVkSGFybmVzc1R5cGVzLmFkZChyZXN1bHQuY29uc3RydWN0b3IpO1xuICAgICAgICBkZWR1cGVkTWF0Y2hlcy5wdXNoKHJlc3VsdCk7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmICghdGVzdEVsZW1lbnRNYXRjaGVkKSB7XG4gICAgICB0ZXN0RWxlbWVudE1hdGNoZWQgPSB0cnVlO1xuICAgICAgZGVkdXBlZE1hdGNoZXMucHVzaChyZXN1bHQpO1xuICAgIH1cbiAgfVxuICByZXR1cm4gZGVkdXBlZE1hdGNoZXMgYXMgVDtcbn1cblxuLyoqIFZlcmlmaWVzIHRoYXQgdGhlcmUgaXMgYXQgbGVhc3Qgb25lIHJlc3VsdCBpbiBhbiBhcnJheS4gKi9cbmFzeW5jIGZ1bmN0aW9uIF9hc3NlcnRSZXN1bHRGb3VuZDxUPihcbiAgcmVzdWx0czogUHJvbWlzZTxUW10+LFxuICBxdWVyeURlc2NyaXB0aW9uczogc3RyaW5nW10sXG4pOiBQcm9taXNlPFQ+IHtcbiAgY29uc3QgcmVzdWx0ID0gKGF3YWl0IHJlc3VsdHMpWzBdO1xuICBpZiAocmVzdWx0ID09IHVuZGVmaW5lZCkge1xuICAgIHRocm93IEVycm9yKFxuICAgICAgYEZhaWxlZCB0byBmaW5kIGVsZW1lbnQgbWF0Y2hpbmcgb25lIG9mIHRoZSBmb2xsb3dpbmcgcXVlcmllczpcXG5gICtcbiAgICAgICAgcXVlcnlEZXNjcmlwdGlvbnMubWFwKGRlc2MgPT4gYCgke2Rlc2N9KWApLmpvaW4oJyxcXG4nKSxcbiAgICApO1xuICB9XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbi8qKiBHZXRzIGEgbGlzdCBvZiBkZXNjcmlwdGlvbiBzdHJpbmdzIGZyb20gYSBsaXN0IG9mIHF1ZXJpZXMuICovXG5mdW5jdGlvbiBfZ2V0RGVzY3JpcHRpb25Gb3JMb2NhdG9yRm9yUXVlcmllcyhxdWVyaWVzOiAoc3RyaW5nIHwgSGFybmVzc1F1ZXJ5PGFueT4pW10pIHtcbiAgcmV0dXJuIHF1ZXJpZXMubWFwKHF1ZXJ5ID0+XG4gICAgdHlwZW9mIHF1ZXJ5ID09PSAnc3RyaW5nJ1xuICAgICAgPyBfZ2V0RGVzY3JpcHRpb25Gb3JUZXN0RWxlbWVudFF1ZXJ5KHF1ZXJ5KVxuICAgICAgOiBfZ2V0RGVzY3JpcHRpb25Gb3JDb21wb25lbnRIYXJuZXNzUXVlcnkocXVlcnkpLFxuICApO1xufVxuXG4vKiogR2V0cyBhIGRlc2NyaXB0aW9uIHN0cmluZyBmb3IgYSBgQ29tcG9uZW50SGFybmVzc2AgcXVlcnkuICovXG5mdW5jdGlvbiBfZ2V0RGVzY3JpcHRpb25Gb3JDb21wb25lbnRIYXJuZXNzUXVlcnkocXVlcnk6IEhhcm5lc3NRdWVyeTxhbnk+KSB7XG4gIGNvbnN0IGhhcm5lc3NQcmVkaWNhdGUgPVxuICAgIHF1ZXJ5IGluc3RhbmNlb2YgSGFybmVzc1ByZWRpY2F0ZSA/IHF1ZXJ5IDogbmV3IEhhcm5lc3NQcmVkaWNhdGUocXVlcnksIHt9KTtcbiAgY29uc3Qge25hbWUsIGhvc3RTZWxlY3Rvcn0gPSBoYXJuZXNzUHJlZGljYXRlLmhhcm5lc3NUeXBlO1xuICBjb25zdCBkZXNjcmlwdGlvbiA9IGAke25hbWV9IHdpdGggaG9zdCBlbGVtZW50IG1hdGNoaW5nIHNlbGVjdG9yOiBcIiR7aG9zdFNlbGVjdG9yfVwiYDtcbiAgY29uc3QgY29uc3RyYWludHMgPSBoYXJuZXNzUHJlZGljYXRlLmdldERlc2NyaXB0aW9uKCk7XG4gIHJldHVybiAoXG4gICAgZGVzY3JpcHRpb24gK1xuICAgIChjb25zdHJhaW50cyA/IGAgc2F0aXNmeWluZyB0aGUgY29uc3RyYWludHM6ICR7aGFybmVzc1ByZWRpY2F0ZS5nZXREZXNjcmlwdGlvbigpfWAgOiAnJylcbiAgKTtcbn1cblxuLyoqIEdldHMgYSBkZXNjcmlwdGlvbiBzdHJpbmcgZm9yIGEgYFRlc3RFbGVtZW50YCBxdWVyeS4gKi9cbmZ1bmN0aW9uIF9nZXREZXNjcmlwdGlvbkZvclRlc3RFbGVtZW50UXVlcnkoc2VsZWN0b3I6IHN0cmluZykge1xuICByZXR1cm4gYFRlc3RFbGVtZW50IGZvciBlbGVtZW50IG1hdGNoaW5nIHNlbGVjdG9yOiBcIiR7c2VsZWN0b3J9XCJgO1xufVxuXG4vKiogR2V0cyBhIGRlc2NyaXB0aW9uIHN0cmluZyBmb3IgYSBgSGFybmVzc0xvYWRlcmAgcXVlcnkuICovXG5mdW5jdGlvbiBfZ2V0RGVzY3JpcHRpb25Gb3JIYXJuZXNzTG9hZGVyUXVlcnkoc2VsZWN0b3I6IHN0cmluZykge1xuICByZXR1cm4gYEhhcm5lc3NMb2FkZXIgZm9yIGVsZW1lbnQgbWF0Y2hpbmcgc2VsZWN0b3I6IFwiJHtzZWxlY3Rvcn1cImA7XG59XG4iXX0=