const AWS = require('aws-sdk');

const uploadToS3=(data, filename)=>{
    const BUCKET_NAME ='expensetracking235';
    const IAM_USER_KEY='AKIAVGJDC44765WCTHP6';
    const IAM_USER_SECRET_KEY ='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';

    let s3bucket = new AWS.S3({
        accessKeyId: IAM_USER_KEY,
        secretAccessKey : IAM_USER_SECRET_KEY
    })
    
    var params = {
        Bucket: BUCKET_NAME,
        Key : filename,
        Body : data,
        ACL: 'public-read'
    }
        return new Promise((resolve,reject )=>{
            s3bucket.upload(params, (err,s3response)=>{
                if(err){
                    console.log('something went wrong', err)
                    reject(err)
                }
                else{
                    console.log('success',s3response);
                    resolve(s3response.Location) ;
                }
            })
        })    
    
}
module.exports={
    uploadToS3
}