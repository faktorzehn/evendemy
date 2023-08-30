import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Pipe, PipeTransform } from "@angular/core";
import { DomSanitizer } from "@angular/platform-browser";
import { Observable, of, from } from "rxjs";
import { catchError, map } from "rxjs/operators";

@Pipe({
  name: "protectedImage",
})
export class ProtectedImagePipe implements PipeTransform {
  constructor(private http: HttpClient, private sanitizer: DomSanitizer) {}

  transform(url: string) {
    const headers = new HttpHeaders({
      Authorization: localStorage.getItem("token"),
      "Content-Type": "application/json",
    });
    return this.http.get(url, {headers: headers, responseType: 'blob'}).pipe(
      map((res: Blob) => {
        let objectURL = URL.createObjectURL(res);       
        return this.sanitizer.bypassSecurityTrustUrl(objectURL);
    }));
  }
}