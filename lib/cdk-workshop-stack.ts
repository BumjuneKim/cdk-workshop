import * as cdk from '@aws-cdk/core';
import * as lambda from '@aws-cdk/aws-lambda';
import * as apigw from '@aws-cdk/aws-apigateway';
import {HitCounter} from "./hitcounter";
import {TableViewer} from "cdk-dynamo-table-viewer";

export class CdkWorkshopStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const hello = new lambda.Function(this, "HelloHandler", {
        runtime: lambda.Runtime.NODEJS_14_X,
        code: lambda.Code.fromAsset('lambda'),
        handler: 'hello.handler'
    });

    const HelloWithCounter = new HitCounter(this, 'HelloHitCounter', {
        downstream: hello
    })

    new apigw.LambdaRestApi(this, 'Endpoint', {
        handler: HelloWithCounter.handler
    });

    new TableViewer(this, 'ViewHitCounter', {
        title: 'Hello Hits',
        table: HelloWithCounter.table
    })
  }
}
