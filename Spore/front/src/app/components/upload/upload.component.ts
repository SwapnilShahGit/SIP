import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FileUploader } from 'ng2-file-upload';

@Component({
    selector: 'upload-factory',
    templateUrl: './upload.component.html',
    styleUrls: ['./upload.component.scss']
})
export class UploadComponent implements OnInit {

    private server: string = ENV == "production" ? "https://spore.life" : "https://localhost:8081";
    private maxFileSize = 1024 * 1024 * 15;
    private uploader: FileUploader = new FileUploader({url: this.server + '/api/parse', maxFileSize: this.maxFileSize, autoUpload: true});
    private hasBaseDropZoneOver: boolean = false;

    constructor(
      private changeDetector: ChangeDetectorRef
    ) { }

    ngOnInit() {
      this.changeDetector.detectChanges();
    }

    public fileOverBase(e) {
      this.hasBaseDropZoneOver = e;
    }

    startUpload(item?) {
      this.uploader.queue.forEach(i => {
        i.onProgress = (progress: any) => {
          this.changeDetector.detectChanges();
        }
      });

      if (item) {
        this.uploader.uploadItem(item);
      } else {
        this.uploader.uploadAll();
      }
    }

}
