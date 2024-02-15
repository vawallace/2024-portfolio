#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { FrontendStack } from '../lib/frontend-stack.cdk.ts';

const app = new cdk.App();
new FrontendStack(app, 'FrontendStack');
