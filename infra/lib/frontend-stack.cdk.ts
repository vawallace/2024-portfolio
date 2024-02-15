import * as cdk from 'aws-cdk-lib';
import * as cloudfront from "aws-cdk-lib/aws-cloudfront";
import * as cloudfrontOrigins from "aws-cdk-lib/aws-cloudfront-origins";
import * as s3Deployment from "aws-cdk-lib/aws-s3-deployment";
import * as s3 from "aws-cdk-lib/aws-s3";
import { Construct } from 'constructs';

const FRONTEND_BUCKET_NAME = "main-site-awallace";
const FRONTEND_DISTRO_NAME = `${FRONTEND_BUCKET_NAME}-distribution`;

export class FrontendStack extends cdk.Stack {
  private cfnOutCloudFrontUrl: cdk.CfnOutput;
  private cfnOutDistributionId: cdk.CfnOutput;

  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const frontendBucket = new s3.Bucket(this, FRONTEND_BUCKET_NAME, {
      bucketName: FRONTEND_BUCKET_NAME,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      publicReadAccess: false,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: true
    });

    const distribution = new cloudfront.Distribution(this, FRONTEND_DISTRO_NAME, {
      defaultBehavior: {
        allowedMethods: cloudfront.AllowedMethods.ALLOW_GET_HEAD_OPTIONS,
        cachedMethods: cloudfront.CachedMethods.CACHE_GET_HEAD,
        origin: new cloudfrontOrigins.S3Origin(frontendBucket),
        compress: true
      },
      defaultRootObject: "index.html",
      errorResponses: [
        {
          httpStatus: 400,
          responseHttpStatus: 200,
          responsePagePath: "/index.html"
        },
        {
          httpStatus: 403,
          responseHttpStatus: 200,
          responsePagePath: "/index.html"
        },
        {
          httpStatus: 404,
          responseHttpStatus: 200,
          responsePagePath: "/index.html"
        }
      ],
      minimumProtocolVersion: cloudfront.SecurityPolicyProtocol.TLS_V1_2_2021,
    });

    new s3Deployment.BucketDeployment(this, "DeployWebsite", {
      sources: [s3Deployment.Source.asset("./dist/")],
      destinationBucket: frontendBucket,
      distribution: distribution
    });

    this.cfnOutCloudFrontUrl = new cdk.CfnOutput(this, "CloudFrontUrl", {
      value: distribution.distributionDomainName,
      description: "The CloudFront URL"
    });

    this.cfnOutDistributionId = new cdk.CfnOutput(this, "DistributionId", {
      value: distribution.distributionId,
      description: "The CloudFront Distribution Id"
    });
  }
}