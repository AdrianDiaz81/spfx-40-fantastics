/**
 * @file
 * 3D Carousel Web Part for SharePoint Framework SPFx
 *
 * Author: Olivier Carpentier
 * Copyright (c) 2016
 */
import {
  BaseClientSideWebPart,
  IPropertyPaneSettings,
  IWebPartContext,
  PropertyPaneDropdown,
  PropertyPaneToggle
} from '@microsoft/sp-client-preview';
import { DisplayMode } from '@microsoft/sp-client-base';

import * as strings from 'fckTextStrings';
import { IFckTextWebPartProps } from './IFckTextWebPartProps';
import ModuleLoader from '@microsoft/sp-module-loader';

//require('jquery');
//require('jqueryui');

//import * as $ from 'jquery';

export default class FckTextWebPart extends BaseClientSideWebPart<IFckTextWebPartProps> {

  private guid: string;

  public constructor(context: IWebPartContext) {
    super(context);

    this.guid = this.getGuid();

    //Hack: to invoke correctly the onPropertyChange function outside this class
    //we need to bind this object on it first
    this.onPropertyChange = this.onPropertyChange.bind(this);
  }

  public render(): void {

    if (this.displayMode == DisplayMode.Edit) {
      //Edit mode
      var html = '';
      html += "<textarea name='" + this.guid + "-editor' id='" + this.guid + "-editor'>" + this.properties.text + "</textarea>";
      this.domElement.innerHTML = html;

      var fMode = 'standard';
      if (this.properties.mode != null)
        fMode = this.properties.mode;
      var ckEditorCdn = '//cdn.ckeditor.com/4.5.11/{0}/ckeditor.js'.replace("{0}", fMode);
      ModuleLoader.loadScript(ckEditorCdn, 'CKEDITOR').then((CKEDITOR: any): void => {
        if (this.properties.inline == null || this.properties.inline === false)
          CKEDITOR.replace( this.guid + '-editor', {
              skin: 'kama,//cdn.ckeditor.com/4.4.3/full-all/skins/' + this.properties.theme + '/'
          }  );
        else
          CKEDITOR.inline( this.guid + '-editor', {
              skin: 'kama,//cdn.ckeditor.com/4.4.3/full-all/skins/' + this.properties.theme + '/'
          }   );

        for (var i in CKEDITOR.instances) {
          CKEDITOR.instances[i].on('change', (elm?, val?) =>
          {
            //CKEDITOR.instances[i].updateElement();
            elm.sender.updateElement();
            var value = ((document.getElementById(this.guid + '-editor')) as any).value;
            if (this.onPropertyChange && value != null) {
              this.properties.text = value;
            }
          });
        }
      });
    }
    else {
      //Read Mode
      this.domElement.innerHTML = this.properties.text;
    }
  }

  private getGuid(): string {
    return this.s4() + this.s4() + '-' + this.s4() + '-' + this.s4() + '-' +
      this.s4() + '-' + this.s4() + this.s4() + this.s4();
  }

  private s4(): string {
      return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
    }

  protected get propertyPaneSettings(): IPropertyPaneSettings {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          displayGroupsAsAccordion: false,
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneToggle('inline', {
                  label: strings.Inline,
                }),
                PropertyPaneDropdown('mode', {
                  label: strings.Mode,
                  options: [
                    {key: 'basic', text: 'basic'},
                    {key: 'standard', text: 'standard'},
                    {key: 'full', text: 'full'}
                  ]
                }),
                PropertyPaneDropdown('theme', {
                  label: strings.Theme,
                  options: [
                    {key: 'kama', text: 'kama'},
                    {key: 'moono', text: 'moono'}
                  ]
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
