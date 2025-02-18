import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'idFormat'
})
export class IdFormatPipe implements PipeTransform {

  transform(id: number): string {
    return id.toString().padStart(5, '0');
  }

}
