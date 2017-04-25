import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FileUploader } from 'ng2-file-upload';
import { CookieService } from 'angular2-cookie/core';
import { TabService } from '../../../meta/tab.service';

@Component({
    selector: 'upload-factory',
    templateUrl: './upload.component.html',
    styleUrls: ['./upload.component.scss']
})
export class UploadComponent implements OnInit {

    private server: string = ENV === 'production' ? 'https://spore.life' : 'https://localhost:8081';
    private maxFileSize = 1024 * 1024 * 15;
    private hasBaseDropZoneOver: boolean = false;
    private userID: string;
    private uploader: FileUploader;

    constructor(
      private changeDetector: ChangeDetectorRef,
      private cookieService: CookieService,
      private tabService: TabService
    ) {
      this.userID = this.cookieService.get('userID');
      this.uploader = new FileUploader({
        url: this.server + '/api/parse',
        maxFileSize: this.maxFileSize,
        autoUpload: true,
        additionalParameter: {
          user: this.userID
        }
      });
      this.uploader.onCompleteItem = (item:any, response:any, status:any, headers:any) => {
        if (status === 200) {
          this.tabService.switchTabs(tabService.coursesTab);
        } else {
          console.log('Parse did not succeed.');
        }
      };
    }

    public ngOnInit() {
      this.changeDetector.detectChanges();
    }

    public fileOverBase(e) {
      this.hasBaseDropZoneOver = e;
    }

    public startUpload(item?) {
      this.uploader.queue.forEach(i => {
        i.onProgress = (progress: any) => {
          this.changeDetector.detectChanges();
        };
      });

      if (item) {
        this.uploader.uploadItem(item);
      } else {
        this.uploader.uploadAll();
      }
    }

}
