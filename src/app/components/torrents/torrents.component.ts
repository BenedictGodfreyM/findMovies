import { Component, Inject, OnDestroy, OnInit, Optional } from '@angular/core';
import { MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA, MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatListModule } from "@angular/material/list";
import { ClipboardModule, ClipboardService } from 'ngx-clipboard';
import { Torrent } from '../../models';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-torrents',
  imports: [CommonModule,MatSnackBarModule,MatBottomSheetModule,ClipboardModule,MatListModule],
  templateUrl: './torrents.component.html',
  styleUrls: ['./torrents.component.css']
})
export class TorrentsComponent implements OnInit, OnDestroy {
  public torrents: Array<{ release_format_type: string; files: Array<Torrent>; quality: string; enphasis: string; }> = new Array();
  private release_format_types = [
    {name: 'Blu-Ray', acronym: 'BluRay', quality: 'Excellent'},
    {name: 'WEB-DOWNLOAD', acronym: 'WEB-DL', quality: 'Excellent'},
    {name: 'HIGH DYNAMIC RANGE: DOLBY VISION', acronym: 'HDR DV', quality: 'Very Good'},
    {name: 'WEBRip', acronym: 'WEBRip', quality: 'Very Good'},
    {name: 'Blu-Ray Rip', acronym: 'BrRip', quality: 'Very Good'},
    {name: 'Blu-Ray Disc Rip', acronym: 'BDRip', quality: 'Good'},
    {name: 'WEB', acronym: 'WEB', quality: 'Good'},
    {name: 'DVDRip', acronym: 'DVDRip', quality: 'Good'},
    {name: 'HDRip', acronym: 'HDRip', quality: 'Good'},
    {name: 'HIGH DEFINITION TELEVISION', acronym: 'HDTV', quality: 'Fair'},
    {name: 'HIGH DEFINITION TELECINE', acronym: 'HDTC', quality: 'Fair'},
    {name: 'HIGH DEFINITION TELESYNC', acronym: 'HDTS', quality: 'Fair'},
    {name: 'DIGITAL DISTRIBUTION COPY', acronym: 'DDC', quality: 'Fair'},
    {name: 'TELECINE', acronym: 'TC', quality: 'Poor'},
    {name: 'DVD-SCREENER', acronym: 'DVDscr', quality: 'Poor'},
    {name: 'TELESYNC-Rip', acronym: 'TSRip', quality: 'Poor'},
    {name: 'TELESYNC', acronym: 'TS', quality: 'Poor'},
    {name: 'HDCAM', acronym: 'HDCAM', quality: 'Poor'},
    {name: 'CAMCORDER-Rip', acronym: 'CAMRip', quality: 'Very Poor'},
    {name: 'CAMCORDER', acronym: 'CAM', quality: 'Very Poor'},
    {name: 'SCREENER', acronym: 'SCR', quality: 'Very Poor'},
  ];

  constructor(private snackBar: MatSnackBar, private bottomSheetRef: MatBottomSheetRef<TorrentsComponent>, private clipboardService: ClipboardService, @Optional() @Inject(MAT_BOTTOM_SHEET_DATA) public data: Array<Torrent>) { }

  ngOnInit(): void {
    this.release_format_types.forEach((format_type, index, arr) => {
      let indices = new Array();
      let regex1 = new RegExp(`[\\s\\(\\[\\]\\.,]*${format_type.acronym}[\\s\\(\\[\\]\\.,]*`, 'i');
      let regex2 = new RegExp(`[\\s\\(\\[\\]\\.,]*${format_type.name}[\\s\\(\\[\\]\\.,]*`, 'i');
      let files = this.data.filter((torr, indx, arry) => {
        if((regex1.test(torr.name.toString()) === true) || (regex1.test(torr.url.toString()) === true) || (regex2.test(torr.name.toString()) === true) || (regex2.test(torr.url.toString()) === true)){
          indices.push(indx);
          return true;
        }else{
          return false;
        }
      });
      if(files.length > 0){
        this.torrents.push({
          release_format_type: format_type.acronym,
          files: files,
          quality: `${format_type.quality} Quality`,
          enphasis: this.generateColorCode(format_type.quality)
        });
        let iterables = indices.length;
        for(let i = 0; i < iterables; i++){
          this.data.splice(indices[i], 1);
          for(let j = i+1; j < iterables; j++) {
            if(indices[i] < indices[j]){
              indices[j]--;
            }
          }
        }
      }
    });
    if(this.data.length > 0){
      this.torrents.push({
          release_format_type: 'Oblivious',
          files: this.data,
          quality: 'Unknown',
          enphasis: this.generateColorCode("Unrecognized")
      });
    }
    if(this.torrents.length < 1) this.bottomSheetRef.dismiss("Torrents not recognized");
  }

  private generateColorCode(quality: string): string{
    let colors = [
      {qty: 'Excellent', code: '#006400', name: 'Dark Green'},
      {qty: 'Very Good', code: '#008000', name: 'Green'},
      {qty: 'Good', code: '#3CB371', name: 'Medium Sea Green'},
      {qty: 'Fair', code: '#6B8E23', name: 'Olive Drab'},
      {qty: 'Poor', code: '#FFA500', name: 'Orange'},
      {qty: 'Very Poor', code: '#FF0000', name: 'Red'},
      {qty: 'Unrecognized', code: '#808080', name: 'Grey'}
    ];
    let match = colors.filter((color, index, arr) => color.qty === quality);
    return match[0].code;
  }

  public copy(file: Torrent): void{
    if(typeof file.magnet !== "undefined" && file.magnet !== null && file.magnet !== ""){
      return this.clipboardService.copy(file.magnet);
    }else if(typeof file.torrent !== "undefined" && file.torrent !== null && file.torrent !== ""){
      return this.clipboardService.copy(file.torrent);
    }else{
      this.snackBar.open("Unable to access Torrent link!", "Ok", { duration: 3000 });
    }
  }

  public calibrateMeasure(count: string | number): string{
    let num = parseInt(`${count}`);
    if(num > 0){
      return `${count}`;
    }else{
      return 'N/A';
    }
  }

  public determineResolution(filename: string): string{
    let regex5760p = new RegExp(`[\\s\\(\\[\\]\\.,]*5760p[\\s\\(\\[\\]\\.,]*`, 'i');
    let regex4320p = new RegExp(`[\\s\\(\\[\\]\\.,]*4320p[\\s\\(\\[\\]\\.,]*`, 'i');
    let regex2160p = new RegExp(`[\\s\\(\\[\\]\\.,]*2160p[\\s\\(\\[\\]\\.,]*`, 'i');
    let regex1200p = new RegExp(`[\\s\\(\\[\\]\\.,]*1200p[\\s\\(\\[\\]\\.,]*`, 'i');
    let regex1080p = new RegExp(`[\\s\\(\\[\\]\\.,]*1080p[\\s\\(\\[\\]\\.,]*`, 'i');
    let regex720p = new RegExp(`[\\s\\(\\[\\]\\.,]*720p[\\s\\(\\[\\]\\.,]*`, 'i');
    if(regex5760p.test(filename.toString()) === true){
      return "5760p";
    }else if(regex4320p.test(filename.toString()) === true){
      return "4320p";
    }else if(regex2160p.test(filename.toString()) === true){
      return "2160p";
    }else if(regex1200p.test(filename.toString()) === true){
      return "1200p";
    }else if(regex1080p.test(filename.toString()) === true){
      return "1080p";
    }else if(regex720p.test(filename.toString()) === true){
      return "720p";
    }else{
      return "N/A";
    }
  }

  ngOnDestroy(): void {
    this.data.splice(0, this.data.length);
    this.torrents.splice(0, this.torrents.length);
  }
}
