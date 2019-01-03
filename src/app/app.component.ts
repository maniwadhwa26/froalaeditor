import { Component, OnInit } from '@angular/core';
import { MailExchangeService } from './mail-exchange.service';
import { ChangeDetectorRef } from "@angular/core";
import { DomSanitizer } from '@angular/platform-browser';
declare var $: any;
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'AngFroalaEdit';
  froalaText;
  textAreaContent;
  stringForLowerAlpha;
  attachments = new Array<any>();
  formData: FormData = new FormData();
  public options: Object;


  constructor(private exchangeMailService: MailExchangeService, private cdref: ChangeDetectorRef, private _DomSanitizationService: DomSanitizer) {

    const self = this;
    this.options = {
      // default
      // toolbarButtons:['fullscreen', 'bold', 'italic', 'underline', 'strikeThrough', 'subscript', 'superscript', '|', 'fontFamily', 'fontSize', 'color', 'inlineClass', 'inlineStyle', 'paragraphStyle', 'lineHeight', '|', 'paragraphFormat', 'align', 'formatOL', 'formatUL', 'outdent', 'indent', 'quote', '-', 'insertLink', 'insertImage', 'insertVideo', 'embedly', 'insertFile', 'insertTable', '|', 'emoticons', 'fontAwesome', 'specialCharacters', 'insertHR', 'selectAll', 'clearFormatting', '|', 'print', 'getPDF', 'spellChecker', 'help', 'html', '|', 'undo', 'redo'],
      toolbarButtons: ['fullscreen', 'bold', 'italic', 'underline', 'strikeThrough', 'subscript', 'superscript', '|', 'fontFamily', 'fontSize', 'color', 'lineHeight', '|', 'paragraphFormat', 'align', 'formatOL', 'formatUL', 'outdent', 'indent', 'quote', '-', 'insertLink', 'insertImage', 'insertFile', 'insertTable', '|', 'specialCharacters', 'insertHR', 'selectAll', 'clearFormatting', '|', 'print', '|', 'undo', 'redo'],
      // Allow to upload PNG and JPG.
      imageAllowedTypes: ['jpeg', 'jpg', 'png'],
      events: {

        'froalaEditor.initialized': function () {

        },
        'froalaEditor.contentChanged': function (e, editor) {

        },
        'froalaEditor.keypress': function (e, editor, keypressEvent) {

        },

        'froalaEditor.keyup': function (e, editor, keypressEvent) {

          const dom = new DOMParser().parseFromString(editor.html.get(), 'text/html');
          const lastP = dom.querySelectorAll('p')[dom.querySelectorAll('p').length - 1];
          if (lastP)
            if (lastP &&
              (
                // chrome || ie
                lastP.innerHTML === 'a.&nbsp;' || lastP.innerHTML === 'a. '
                ||
                lastP.innerHTML === 'A.&nbsp;' || lastP.innerHTML === 'A. '
                ||
                lastP.innerHTML === '1.&nbsp;' || lastP.innerHTML === '1. '

              )
            ) {

              dom.querySelectorAll('p')[dom.querySelectorAll('p').length - 1].parentNode.removeChild(lastP);
              var listOb = dom.createElement('OL');
              if (lastP.innerHTML === 'a.&nbsp;' || lastP.innerHTML === 'a. ') {
                listOb.style.cssText = 'list-style-type: lower-alpha;';
              }
              if (lastP.innerHTML === 'A.&nbsp;' || lastP.innerHTML === 'A. ') {
                listOb.style.cssText = 'list-style-type: upper-alpha;';
              }
              var liOb = document.createElement("LI");
              listOb.appendChild(liOb);
              dom.body.appendChild(listOb);
              editor.html.set('');
              editor.html.insert(dom.documentElement.innerHTML);


            }


        },
        'froalaEditor.image.beforeUpload': function (e, editor, files) {

          if (files.length) {
            // Create a File Reader.
            const reader = new FileReader();

            // Set the reader to insert images when they are loaded.
            reader.onload = function (event) {
              const result = event.target.result;
              editor.image.insert(result, null, null, editor.image.get());
            };

            // Read image as base64.
            reader.readAsDataURL(files[0]);
          }

          editor.popups.hideAll();

          // Stop default upload chain.
          return false;
        },
        'froalaEditor.file.beforeUpload': function (e, editor, files) {

          if (files.length) {
            if (self.attachments.findIndex(x => x.name === files[0].name) >= 0) {
              alert('File Already Attached');
              return false;
            }
            //    self.formData.append(files[0].name, files[0], files[0].name);
            const reader = new FileReader();
            reader['fileName'] = files[0].name;
            // Set the reader to insert images when they are loaded.
            reader.onload = function (event) {
              const result = event.target.result;

              self.attachments.push(
                {
                  'data': self._DomSanitizationService.bypassSecurityTrustUrl(result),
                  'name': reader['fileName'],
                  formData: files[0]
                }
              );

              self.cdref.detectChanges();

            };

            // Read file as base64.
            reader.readAsDataURL(files[0]);

          }
          editor.popups.hideAll();

          return false;
        },

      },

      useClasses: false,
      // tableStyles: {


      // }

    }
  }




  ngOnInit() { }

  SendMail() {

    this.formData = new FormData();
    for (let ind = 0; ind < this.attachments.length; ind++) {
      const currentAttachment = this.attachments[ind];
      this.formData.append(currentAttachment.name, currentAttachment.formData, currentAttachment.name);
    }
    this.formData.append('mailBody', encodeURI(this.froalaText.replace(/fr-original-class/g, 'class').replace(/data%3A/g, 'data:')));
    this.exchangeMailService.SendMail(this.formData).subscribe(
      res => {
        // this.attachments = [];
      }
      ,
      err => {
      }
    );
  }

  SetContent() {
    this.froalaText = this.textAreaContent;
  }
  DownlaodFile(fileData) {
    window.open(fileData, "_blank");
  }
  DeleteAttachment(attachment) {
    const indexAttachment = this.attachments.findIndex(x => x.name === attachment.name);
    // this.formData.delete(this.attachments[indexAttachment].name);
    this.attachments.splice(indexAttachment, 1);
    this.cdref.detectChanges();
  }
}
