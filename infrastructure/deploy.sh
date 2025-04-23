#!/bin/bash

# CloudMasters Website Deployment Script
# This script deploys the static website to AWS using CloudFormation

# Configuration
STACK_NAME="cloud-training-website"
TEMPLATE_FILE="cloudformation-template.yaml"
DOMAIN_NAME="cloudtraining.example.com"  # Replace with your actual domain
REGION="us-east-1"                       # Replace with your preferred region
HOSTED_ZONE_ID=""                        # Replace with your Route 53 Hosted Zone ID if using Route 53

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
NC='\033[0m' # No Color

# Function to display usage information
usage() {
    echo -e "${YELLOW}Usage:${NC}"
    echo -e "  $0 [options]"
    echo ""
    echo -e "${YELLOW}Options:${NC}"
    echo -e "  --domain <domain>       Domain name for the website (default: $DOMAIN_NAME)"
    echo -e "  --region <region>       AWS region (default: $REGION)"
    echo -e "  --stack <name>          CloudFormation stack name (default: $STACK_NAME)"
    echo -e "  --hosted-zone <id>      Route 53 Hosted Zone ID (required for DNS records)"
    echo -e "  --no-dns                Skip creating Route 53 DNS records"
    echo -e "  --help                  Display this help message"
    exit 1
}

# Parse command line arguments
CREATE_DNS_RECORDS="true"
while [[ $# -gt 0 ]]; do
    key="$1"
    case $key in
        --domain)
            DOMAIN_NAME="$2"
            shift 2
            ;;
        --region)
            REGION="$2"
            shift 2
            ;;
        --stack)
            STACK_NAME="$2"
            shift 2
            ;;
        --hosted-zone)
            HOSTED_ZONE_ID="$2"
            shift 2
            ;;
        --no-dns)
            CREATE_DNS_RECORDS="false"
            shift
            ;;
        --help)
            usage
            ;;
        *)
            echo -e "${RED}Unknown option: $1${NC}"
            usage
            ;;
    esac
done

# Check if AWS CLI is installed
if ! command -v aws &> /dev/null; then
    echo -e "${RED}Error: AWS CLI is not installed. Please install it first.${NC}"
    exit 1
fi

# Check if jq is installed (for parsing AWS CLI output)
if ! command -v jq &> /dev/null; then
    echo -e "${YELLOW}Warning: jq is not installed. Some features may not work correctly.${NC}"
fi

# Validate parameters
if [ "$CREATE_DNS_RECORDS" = "true" ] && [ -z "$HOSTED_ZONE_ID" ]; then
    echo -e "${RED}Error: Hosted Zone ID is required when creating DNS records.${NC}"
    echo -e "${YELLOW}Use --hosted-zone <id> to specify the Hosted Zone ID or --no-dns to skip DNS record creation.${NC}"
    exit 1
fi

echo -e "${GREEN}=== CloudMasters Website Deployment ===${NC}"
echo -e "Domain: $DOMAIN_NAME"
echo -e "Region: $REGION"
echo -e "Stack Name: $STACK_NAME"
echo -e "Create DNS Records: $CREATE_DNS_RECORDS"
if [ "$CREATE_DNS_RECORDS" = "true" ]; then
    echo -e "Hosted Zone ID: $HOSTED_ZONE_ID"
fi
echo ""

# Deploy CloudFormation stack
echo -e "${GREEN}Deploying CloudFormation stack...${NC}"
aws cloudformation deploy \
    --template-file $TEMPLATE_FILE \
    --stack-name $STACK_NAME \
    --parameter-overrides \
        DomainName=$DOMAIN_NAME \
        CreateRoute53Records=$CREATE_DNS_RECORDS \
        HostedZoneId=$HOSTED_ZONE_ID \
    --capabilities CAPABILITY_IAM \
    --region $REGION

# Check if deployment was successful
if [ $? -eq 0 ]; then
    echo -e "${GREEN}CloudFormation stack deployed successfully!${NC}"
    
    # Get stack outputs
    echo -e "${GREEN}Retrieving deployment information...${NC}"
    OUTPUTS=$(aws cloudformation describe-stacks --stack-name $STACK_NAME --region $REGION --query "Stacks[0].Outputs" --output json)
    
    # Extract values from outputs
    BUCKET_NAME=$(echo $OUTPUTS | jq -r '.[] | select(.OutputKey=="WebsiteBucketName") | .OutputValue')
    CLOUDFRONT_ID=$(echo $OUTPUTS | jq -r '.[] | select(.OutputKey=="CloudFrontDistributionId") | .OutputValue')
    CLOUDFRONT_DOMAIN=$(echo $OUTPUTS | jq -r '.[] | select(.OutputKey=="CloudFrontDomainName") | .OutputValue')
    WEBSITE_URL=$(echo $OUTPUTS | jq -r '.[] | select(.OutputKey=="WebsiteURL") | .OutputValue')
    
    echo -e "${GREEN}Deployment Information:${NC}"
    echo -e "S3 Bucket: $BUCKET_NAME"
    echo -e "CloudFront Distribution ID: $CLOUDFRONT_ID"
    echo -e "CloudFront Domain: $CLOUDFRONT_DOMAIN"
    echo -e "Website URL: $WEBSITE_URL"
    
    # Upload website files to S3
    echo -e "${GREEN}Uploading website files to S3...${NC}"
    aws s3 sync ../src/ s3://$BUCKET_NAME/ --delete --region $REGION
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}Website files uploaded successfully!${NC}"
        
        # Invalidate CloudFront cache
        echo -e "${GREEN}Invalidating CloudFront cache...${NC}"
        aws cloudfront create-invalidation --distribution-id $CLOUDFRONT_ID --paths "/*" --region $REGION
        
        echo -e "${GREEN}Deployment complete!${NC}"
        echo -e "Your website is now available at: ${YELLOW}$WEBSITE_URL${NC}"
        
        if [ "$CREATE_DNS_RECORDS" = "true" ]; then
            echo -e "${YELLOW}Note: DNS propagation may take some time. Your website will be available at https://$DOMAIN_NAME once DNS propagates.${NC}"
        fi
    else
        echo -e "${RED}Error: Failed to upload website files to S3.${NC}"
        exit 1
    fi
else
    echo -e "${RED}Error: CloudFormation stack deployment failed.${NC}"
    exit 1
fi
