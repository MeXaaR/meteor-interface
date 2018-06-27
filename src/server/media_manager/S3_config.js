import AWS from 'aws-sdk';
import { InterfaceCollections } from '../../lib/core'

export const S3_Client = async function(){
    const interfaceSettings = InterfaceCollections.settings.findOne();
    try {
        const credentials = {
            accessKeyId: interfaceSettings.AWSAccessKeyId,
            secretAccessKey: interfaceSettings.AWSSecretAccessKey,
            s3_signature_version: 'v4',
        }
          const s3 = await new AWS.S3 (credentials);          
          return s3 
    } catch (error) {
        console.log(error)
    }
}
