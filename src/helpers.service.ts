import { Injectable } from '@angular/core';
@Injectable({
    providedIn: 'root',
  })
export class HelpersService {
  clientStatus(status: string) {
    return (status === 'assigned' ? 'invited' : ((status === 'active') ? 'assigned' : status))
  }
}