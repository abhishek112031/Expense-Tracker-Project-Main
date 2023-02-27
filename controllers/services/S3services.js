const AWS=require('aws-sdk');
const dotenv=require('dotenv');
dotenv.config();

const uploadToS3=(data,filename)=>{
    const bucket_name=process.env.BUCKET_NAME;
    const iam_user_key=process.env.IAM_USER_KEY;
    const iam_user_secret=process.env.IAM_USER_SECRET;
  
    let s3Bucket= new AWS.S3({
      accessKeyId:iam_user_key,
      secretAccessKey:iam_user_secret,
      // Bucket:bucket_name
    });
    
    var params={
        Bucket:bucket_name,
        Key:filename,
        Body:data,
        ACL:'public-read'
  
      }
      return new Promise((resolve,reject)=>{
  
        s3Bucket.upload(params,(err,s3Resp)=>{
          if(err){
            console.log('something went wrong',err);
            reject(err);
          }
          else{
            console.log("success",s3Resp);
            resolve(s3Resp.Location);
          }
        })
  
  
      })
    
  
  }

module.exports={
    uploadToS3
}  