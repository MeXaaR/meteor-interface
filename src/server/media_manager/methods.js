import { S3_Client } from './S3_config';
import { InterfaceCollections } from '../../lib/core';

// Global Config
import configuration from '../../lib/configuration'



Meteor.methods({
    async 'interface.media.list.directories'({ path }){
        const config = configuration.get()
        // Extract datas from config
        const { 
            roles = [],
            media_roles = []
        } = config

        const isAuthorized = Roles.userIsInRole(this.userId, roles);
        if(!isAuthorized){
            throw new Meteor.Error(500, "You are not authorized to do this action.")
        }
        const interfaceSettings = InterfaceCollections.settings.findOne();
        const { AWSBucket, AWSRegion } = interfaceSettings
        const s3params = {
            Bucket: AWSBucket,
            MaxKeys: 100,
            Delimiter: '/',
            Prefix: path
          };
          const link = `https://s3-${AWSRegion}.amazonaws.com/${AWSBucket}/`

          try {
              const client = await S3_Client();
              const results = new Promise ((resolve, reject) => {
                client.listObjectsV2 (s3params, (err, data) => {
                  if (err) {
                    resolve ({err});
                  }
                  resolve ({ ...data, link });
                });
              });
              return results
          } catch (error) {
              throw new Meteor.Error(error.statusCode, error.message)
          }
    },
    async 'interface.media.create.directory'({ name }){
        const config = configuration.get()
        // Extract datas from config
        const { 
            roles = [],
            media_roles = []
        } = config
        const isAuthorized = Roles.userIsInRole(this.userId, media_roles);
        if(!isAuthorized){
            throw new Meteor.Error(500, "You are not authorized to do this action.")
        }
        const interfaceSettings = InterfaceCollections.settings.findOne();
        const { AWSBucket, AWSRegion } = interfaceSettings
        const s3params = {
            Bucket: AWSBucket,
            Key: `${name}/`
        };
        const link = `https://s3-${AWSRegion}.amazonaws.com/${AWSBucket}/`

        try {
            const client = await S3_Client();
            const results = new Promise ((resolve, reject) => {
              client.putObject (s3params, (err, data) => {
                if (err) {
                  resolve ({err});
                }
                resolve ({ ...data, link });
              });
            });
            return results
        } catch (error) {
            throw new Meteor.Error(error.statusCode, error.message)
        }
    },
    async 'interface.media.delete.object'({ file }){
        const config = configuration.get()
        // Extract datas from config
        const { 
            roles = [],
            media_roles = []
        } = config
        const isAuthorized = Roles.userIsInRole(this.userId, media_roles);
        if(!isAuthorized){
            throw new Meteor.Error(500, "You are not authorized to do this action.")
        }
        const interfaceSettings = InterfaceCollections.settings.findOne();
        const { AWSBucket, AWSRegion } = interfaceSettings
        const s3params = {
            Bucket: AWSBucket,
            Key: `${file}`
        };
        const link = `https://s3-${AWSRegion}.amazonaws.com/${AWSBucket}/`

        try {
            const client = await S3_Client();
            const results = new Promise ((resolve, reject) => {
              client.deleteObject (s3params, (err, data) => {
                if (err) {
                  resolve ({err});
                }
                resolve ({ ...data, link });
              });
            });
            return results
        } catch (error) {
            throw new Meteor.Error(error.statusCode, error.message)
        }
    },
    async 'interface.media.upload.object'({ file, path, mimeType, name }){
        const config = configuration.get()
        // Extract datas from config
        const { 
            roles = [],
            media_roles = []
        } = config
        
        const isAuthorized = Roles.userIsInRole(this.userId, media_roles);
        if(!isAuthorized){
            throw new Meteor.Error(500, "You are not authorized to do this action.")
        }
        const bufferImage = Buffer.from(file, 'base64')

        const interfaceSettings = InterfaceCollections.settings.findOne();
        const { AWSBucket, AWSRegion } = interfaceSettings
        const s3params = {
            Body: bufferImage,
            Bucket: AWSBucket,
            ContentEncoding: 'base64',
            ContentType: mimeType,
            ACL: 'public-read',
            Key: `${path ? path + name : name }`
        };
        const link = `https://s3-${AWSRegion}.amazonaws.com/${AWSBucket}/`

        try {
            const client = await S3_Client();
            const results = new Promise ((resolve, reject) => {
              client.putObject (s3params, (err, data) => {
                if (err) {
                  resolve ({err});
                }
                resolve ({ ...data, link });
              });
            });
            return results
        } catch (error) {
            throw new Meteor.Error(error.statusCode, error.message)
        }
    }
})
