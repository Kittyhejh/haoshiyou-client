import {Injectable, Inject} from "@angular/core";
import {loggerToken} from "./log.service";
import {Logger} from "log4javascript";
import {Transfer} from "ionic-native";
@Injectable()
export class IImageService {

  /**
   * @param localUris
   * @returns {Promise<any>|Promise<TAll[]>} a list of public id of stored image.
   * In failure, it will reject at the first failure and tell why,
   */
  uploadImagesAndGetIds(localUris:string[]):Promise<string[]> {
    throw "Not implemented";
  };

  /**
   * Get a url string from image id.
   * @param id
   */
  getUrlFromId(id:string, width:number = 300, height:number = 300):string {
    throw "Not implemented";
  }
}

@Injectable()
export class CloudinaryImageService implements IImageService {
  private config:CloudinaryConfig;

  constructor(@Inject(loggerToken) private logger:Logger) {
    // TODO(xinbenlv): update the credentials of CloudinaryImageService.
    this.config = <CloudinaryConfig>{
      cloud_name: "xinbenlv",
      api_key: "999284541119412",
      upload_preset: "haoshiyou-dev"
    };
  }

  /**
   * override
   */
  uploadImagesAndGetIds(localUris:string[]):Promise<any[]> {
    let fileTransfer = new Transfer();
    var uploadUrl:string = "https://api.cloudinary.com/v1_1/" + this.config.cloud_name + "/image/upload";
    return Promise.all(
        localUris.map((uri:string) => {
          this.logger.info(`Uploading file ${uri}...`);
          return fileTransfer.upload(uri, uploadUrl, {
            params: this.config
          }).then((result)=> {
            let data = JSON.parse(result.response);
            this.logger.info(`Uploaded file ${uri}, returned id=${data.public_id}`);
            return data.public_id;
          }).catch((error)=> {
            this.logger.error(`Uploaded file ${uri} failed with error=${JSON.stringify(error)}`);
          });
        })
    );
  }

  //noinspection JSUnusedGlobalSymbols
  /**
   * override
   */
  getUrlFromId(id:string, width:number = 300, height:number = 300):string {
    return `http://res.cloudinary.com/${this.config.cloud_name}/image/upload/w_300,h_300,c_fill/${id}.jpg`;
  }
}

interface CloudinaryConfig {
  cloud_name:string,
  api_key:string,
  upload_preset:string,
}