import { reflow } from '../util';
function measureCollapsingElementHeightPx(element) {
    // SSR fix for without injecting the PlatformId
    if (typeof navigator === 'undefined') {
        return '0px';
    }
    const { classList } = element;
    const hasShownClass = classList.contains('show');
    if (!hasShownClass) {
        classList.add('show');
    }
    element.style.height = '';
    const height = element.getBoundingClientRect().height + 'px';
    if (!hasShownClass) {
        classList.remove('show');
    }
    return height;
}
export const ngbCollapsingTransition = (element, animation, context) => {
    let { direction, maxHeight } = context;
    const { classList } = element;
    function setInitialClasses() {
        classList.add('collapse');
        if (direction === 'show') {
            classList.add('show');
        }
        else {
            classList.remove('show');
        }
    }
    // without animations we just need to set initial classes
    if (!animation) {
        setInitialClasses();
        return;
    }
    // No maxHeight -> running the transition for the first time
    if (!maxHeight) {
        maxHeight = measureCollapsingElementHeightPx(element);
        context.maxHeight = maxHeight;
        // Fix the height before starting the animation
        element.style.height = direction !== 'show' ? maxHeight : '0px';
        classList.remove('collapse');
        classList.remove('collapsing');
        classList.remove('show');
        reflow(element);
        // Start the animation
        classList.add('collapsing');
    }
    // Start or revert the animation
    element.style.height = direction === 'show' ? maxHeight : '0px';
    return () => {
        setInitialClasses();
        classList.remove('collapsing');
        element.style.height = '';
    };
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmdiQ29sbGFwc2VUcmFuc2l0aW9uLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vc3JjL3V0aWwvdHJhbnNpdGlvbi9uZ2JDb2xsYXBzZVRyYW5zaXRpb24udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQ0EsT0FBTyxFQUFDLE1BQU0sRUFBQyxNQUFNLFNBQVMsQ0FBQztBQU8vQixTQUFTLGdDQUFnQyxDQUFDLE9BQW9CO0lBQzVELCtDQUErQztJQUMvQyxJQUFJLE9BQU8sU0FBUyxLQUFLLFdBQVcsRUFBRTtRQUNwQyxPQUFPLEtBQUssQ0FBQztLQUNkO0lBRUQsTUFBTSxFQUFDLFNBQVMsRUFBQyxHQUFHLE9BQU8sQ0FBQztJQUM1QixNQUFNLGFBQWEsR0FBRyxTQUFTLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQ2pELElBQUksQ0FBQyxhQUFhLEVBQUU7UUFDbEIsU0FBUyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQztLQUN2QjtJQUVELE9BQU8sQ0FBQyxLQUFLLENBQUMsTUFBTSxHQUFHLEVBQUUsQ0FBQztJQUMxQixNQUFNLE1BQU0sR0FBRyxPQUFPLENBQUMscUJBQXFCLEVBQUUsQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDO0lBRTdELElBQUksQ0FBQyxhQUFhLEVBQUU7UUFDbEIsU0FBUyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQztLQUMxQjtJQUVELE9BQU8sTUFBTSxDQUFDO0FBQ2hCLENBQUM7QUFFRCxNQUFNLENBQUMsTUFBTSx1QkFBdUIsR0FDaEMsQ0FBQyxPQUFvQixFQUFFLFNBQWtCLEVBQUUsT0FBdUIsRUFBRSxFQUFFO0lBQ3BFLElBQUksRUFBQyxTQUFTLEVBQUUsU0FBUyxFQUFDLEdBQUcsT0FBTyxDQUFDO0lBQ3JDLE1BQU0sRUFBQyxTQUFTLEVBQUMsR0FBRyxPQUFPLENBQUM7SUFFNUIsU0FBUyxpQkFBaUI7UUFDeEIsU0FBUyxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsQ0FBQztRQUMxQixJQUFJLFNBQVMsS0FBSyxNQUFNLEVBQUU7WUFDeEIsU0FBUyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQztTQUN2QjthQUFNO1lBQ0wsU0FBUyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQztTQUMxQjtJQUNILENBQUM7SUFFRCx5REFBeUQ7SUFDekQsSUFBSSxDQUFDLFNBQVMsRUFBRTtRQUNkLGlCQUFpQixFQUFFLENBQUM7UUFDcEIsT0FBTztLQUNSO0lBRUQsNERBQTREO0lBQzVELElBQUksQ0FBQyxTQUFTLEVBQUU7UUFDZCxTQUFTLEdBQUcsZ0NBQWdDLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDdEQsT0FBTyxDQUFDLFNBQVMsR0FBRyxTQUFTLENBQUM7UUFFOUIsK0NBQStDO1FBQy9DLE9BQU8sQ0FBQyxLQUFLLENBQUMsTUFBTSxHQUFHLFNBQVMsS0FBSyxNQUFNLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDO1FBRWhFLFNBQVMsQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDLENBQUM7UUFDN0IsU0FBUyxDQUFDLE1BQU0sQ0FBQyxZQUFZLENBQUMsQ0FBQztRQUMvQixTQUFTLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBRXpCLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUVoQixzQkFBc0I7UUFDdEIsU0FBUyxDQUFDLEdBQUcsQ0FBQyxZQUFZLENBQUMsQ0FBQztLQUM3QjtJQUVELGdDQUFnQztJQUNoQyxPQUFPLENBQUMsS0FBSyxDQUFDLE1BQU0sR0FBRyxTQUFTLEtBQUssTUFBTSxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQztJQUVoRSxPQUFPLEdBQUcsRUFBRTtRQUNWLGlCQUFpQixFQUFFLENBQUM7UUFDcEIsU0FBUyxDQUFDLE1BQU0sQ0FBQyxZQUFZLENBQUMsQ0FBQztRQUMvQixPQUFPLENBQUMsS0FBSyxDQUFDLE1BQU0sR0FBRyxFQUFFLENBQUM7SUFDNUIsQ0FBQyxDQUFDO0FBQ0osQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtOZ2JUcmFuc2l0aW9uU3RhcnRGbn0gZnJvbSAnLi9uZ2JUcmFuc2l0aW9uJztcclxuaW1wb3J0IHtyZWZsb3d9IGZyb20gJy4uL3V0aWwnO1xyXG5cclxuZXhwb3J0IGludGVyZmFjZSBOZ2JDb2xsYXBzZUN0eCB7XHJcbiAgZGlyZWN0aW9uOiAnc2hvdycgfCAnaGlkZSc7XHJcbiAgbWF4SGVpZ2h0Pzogc3RyaW5nO1xyXG59XHJcblxyXG5mdW5jdGlvbiBtZWFzdXJlQ29sbGFwc2luZ0VsZW1lbnRIZWlnaHRQeChlbGVtZW50OiBIVE1MRWxlbWVudCk6IHN0cmluZyB7XHJcbiAgLy8gU1NSIGZpeCBmb3Igd2l0aG91dCBpbmplY3RpbmcgdGhlIFBsYXRmb3JtSWRcclxuICBpZiAodHlwZW9mIG5hdmlnYXRvciA9PT0gJ3VuZGVmaW5lZCcpIHtcclxuICAgIHJldHVybiAnMHB4JztcclxuICB9XHJcblxyXG4gIGNvbnN0IHtjbGFzc0xpc3R9ID0gZWxlbWVudDtcclxuICBjb25zdCBoYXNTaG93bkNsYXNzID0gY2xhc3NMaXN0LmNvbnRhaW5zKCdzaG93Jyk7XHJcbiAgaWYgKCFoYXNTaG93bkNsYXNzKSB7XHJcbiAgICBjbGFzc0xpc3QuYWRkKCdzaG93Jyk7XHJcbiAgfVxyXG5cclxuICBlbGVtZW50LnN0eWxlLmhlaWdodCA9ICcnO1xyXG4gIGNvbnN0IGhlaWdodCA9IGVsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkuaGVpZ2h0ICsgJ3B4JztcclxuXHJcbiAgaWYgKCFoYXNTaG93bkNsYXNzKSB7XHJcbiAgICBjbGFzc0xpc3QucmVtb3ZlKCdzaG93Jyk7XHJcbiAgfVxyXG5cclxuICByZXR1cm4gaGVpZ2h0O1xyXG59XHJcblxyXG5leHBvcnQgY29uc3QgbmdiQ29sbGFwc2luZ1RyYW5zaXRpb246IE5nYlRyYW5zaXRpb25TdGFydEZuPE5nYkNvbGxhcHNlQ3R4PiA9XHJcbiAgICAoZWxlbWVudDogSFRNTEVsZW1lbnQsIGFuaW1hdGlvbjogYm9vbGVhbiwgY29udGV4dDogTmdiQ29sbGFwc2VDdHgpID0+IHtcclxuICAgICAgbGV0IHtkaXJlY3Rpb24sIG1heEhlaWdodH0gPSBjb250ZXh0O1xyXG4gICAgICBjb25zdCB7Y2xhc3NMaXN0fSA9IGVsZW1lbnQ7XHJcblxyXG4gICAgICBmdW5jdGlvbiBzZXRJbml0aWFsQ2xhc3NlcygpIHtcclxuICAgICAgICBjbGFzc0xpc3QuYWRkKCdjb2xsYXBzZScpO1xyXG4gICAgICAgIGlmIChkaXJlY3Rpb24gPT09ICdzaG93Jykge1xyXG4gICAgICAgICAgY2xhc3NMaXN0LmFkZCgnc2hvdycpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBjbGFzc0xpc3QucmVtb3ZlKCdzaG93Jyk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcblxyXG4gICAgICAvLyB3aXRob3V0IGFuaW1hdGlvbnMgd2UganVzdCBuZWVkIHRvIHNldCBpbml0aWFsIGNsYXNzZXNcclxuICAgICAgaWYgKCFhbmltYXRpb24pIHtcclxuICAgICAgICBzZXRJbml0aWFsQ2xhc3NlcygpO1xyXG4gICAgICAgIHJldHVybjtcclxuICAgICAgfVxyXG5cclxuICAgICAgLy8gTm8gbWF4SGVpZ2h0IC0+IHJ1bm5pbmcgdGhlIHRyYW5zaXRpb24gZm9yIHRoZSBmaXJzdCB0aW1lXHJcbiAgICAgIGlmICghbWF4SGVpZ2h0KSB7XHJcbiAgICAgICAgbWF4SGVpZ2h0ID0gbWVhc3VyZUNvbGxhcHNpbmdFbGVtZW50SGVpZ2h0UHgoZWxlbWVudCk7XHJcbiAgICAgICAgY29udGV4dC5tYXhIZWlnaHQgPSBtYXhIZWlnaHQ7XHJcblxyXG4gICAgICAgIC8vIEZpeCB0aGUgaGVpZ2h0IGJlZm9yZSBzdGFydGluZyB0aGUgYW5pbWF0aW9uXHJcbiAgICAgICAgZWxlbWVudC5zdHlsZS5oZWlnaHQgPSBkaXJlY3Rpb24gIT09ICdzaG93JyA/IG1heEhlaWdodCA6ICcwcHgnO1xyXG5cclxuICAgICAgICBjbGFzc0xpc3QucmVtb3ZlKCdjb2xsYXBzZScpO1xyXG4gICAgICAgIGNsYXNzTGlzdC5yZW1vdmUoJ2NvbGxhcHNpbmcnKTtcclxuICAgICAgICBjbGFzc0xpc3QucmVtb3ZlKCdzaG93Jyk7XHJcblxyXG4gICAgICAgIHJlZmxvdyhlbGVtZW50KTtcclxuXHJcbiAgICAgICAgLy8gU3RhcnQgdGhlIGFuaW1hdGlvblxyXG4gICAgICAgIGNsYXNzTGlzdC5hZGQoJ2NvbGxhcHNpbmcnKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgLy8gU3RhcnQgb3IgcmV2ZXJ0IHRoZSBhbmltYXRpb25cclxuICAgICAgZWxlbWVudC5zdHlsZS5oZWlnaHQgPSBkaXJlY3Rpb24gPT09ICdzaG93JyA/IG1heEhlaWdodCA6ICcwcHgnO1xyXG5cclxuICAgICAgcmV0dXJuICgpID0+IHtcclxuICAgICAgICBzZXRJbml0aWFsQ2xhc3NlcygpO1xyXG4gICAgICAgIGNsYXNzTGlzdC5yZW1vdmUoJ2NvbGxhcHNpbmcnKTtcclxuICAgICAgICBlbGVtZW50LnN0eWxlLmhlaWdodCA9ICcnO1xyXG4gICAgICB9O1xyXG4gICAgfTtcclxuIl19