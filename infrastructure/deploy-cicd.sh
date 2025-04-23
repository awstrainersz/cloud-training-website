#!/bin/bash

# CloudMasters Website CI/CD Deployment Script
# This script deploys the static website with CI/CD pipeline to AWS using CloudFormation

# Configuration
STACK_NAME="cloud-training-website"
TEMPLATE_FILE="cloudformation-template-cicd.yaml"
DOMAIN_NAME="cloudtraining.example.com"  # Replace with your actual domain
REGION="us-east-1"                       # Replace with your preferred region
HOSTED_ZONE_ID=""                        # Replace with your Route 53 Hosted Zone ID if using Route 53
GITHUB_OWNER=""                          # GitHub repository owner
GITHUB_REPO="cloud-training-website"     # GitHub repository name
GITHUB_BRANCH="main"                     # GitHub branch to monitor
GITHUB_TOKEN=""                          # GitHub OAuth token
ENVIRONMENT="prod"                       # Deployment environment
NOTIFICATION_EMAIL=""                    # Email for pipeline notifications
DEFAULT_CACHE_TTL=86400                  # Default CloudFront cache TTL in seconds
WEBSITE_SOURCE_PATH="src"                # Path to website source files in the repository

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
    echo -e "  --domain <domain>           Domain name for the website (default: $DOMAIN_NAME)"
    echo -e "  --region <region>           AWS region (default: $REGION)"
    echo -e "  --stack <name>              CloudFormation stack name (default: $STACK_NAME)"
    echo -e "  --hosted-zone <id>          Route 53 Hosted Zone ID (required for DNS records)"
    echo -e "  --no-dns                    Skip creating Route 53 DNS records"
    echo -e "  --github-owner <owner>      GitHub repository owner (required)"
    echo -e "  --github-repo <repo>        GitHub repository name (default: $GITHUB_REPO)"
    echo -e "  --github-branch <branch>    GitHub branch to monitor (default: $GITHUB_BRANCH)"
    echo -e "  --github-token <token>      GitHub OAuth token (required)"
    echo -e "  --environment <env>         Deployment environment (default: $ENVIRONMENT)"
    echo -e "  --notification-email <email> Email for pipeline notifications"
    echo -e "  --cache-ttl <seconds>       Default CloudFront cache TTL (default: $DEFAULT_CACHE_TTL)"
    echo -e "  --source-path <path>        Path to website source files (default: $WEBSITE_SOURCE_PATH)"
    echo -e "  --help                      Display this help message"
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
        --github-owner)
            GITHUB_OWNER="$2"
            shift 2
            ;;
        --github-repo)
            GITHUB_REPO="$2"
            shift 2
            ;;
        --github-branch)
            GITHUB_BRANCH="$2"
            shift 2
            ;;
        --github-token)
            GITHUB_TOKEN="$2"
            shift 2
            ;;
        --environment)
            ENVIRONMENT="$2"
            shift 2
            ;;
        --notification-email)
            NOTIFICATION_EMAIL="$2"
            shift 2
            ;;
        --cache-ttl)
            DEFAULT_CACHE_TTL="$2"
            shift 2
            ;;
        --source-path)
            WEBSITE_SOURCE_PATH="$2"
            shift 2
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

if [ -z "$GITHUB_OWNER" ]; then
    echo -e "${RED}Error: GitHub owner is required.${NC}"
    echo -e "${YELLOW}Use --github-owner <owner> to specify the GitHub repository owner.${NC}"
    exit 1
fi

if [ -z "$GITHUB_TOKEN" ]; then
    echo -e "${RED}Error: GitHub token is required.${NC}"
    echo -e "${YELLOW}Use --github-token <token> to specify the GitHub OAuth token.${NC}"
    exit 1
fi

echo -e "${GREEN}=== CloudMasters Website CI/CD Deployment ===${NC}"
echo -e "Domain: $DOMAIN_NAME"
echo -e "Region: $REGION"
echo -e "Stack Name: $STACK_NAME"
echo -e "Create DNS Records: $CREATE_DNS_RECORDS"
if [ "$CREATE_DNS_RECORDS" = "true" ]; then
    echo -e "Hosted Zone ID: $HOSTED_ZONE_ID"
fi
echo -e "GitHub Repository: $GITHUB_OWNER/$GITHUB_REPO"
echo -e "GitHub Branch: $GITHUB_BRANCH"
echo -e "Environment: $ENVIRONMENT"
echo -e "Website Source Path: $WEBSITE_SOURCE_PATH"
if [ -n "$NOTIFICATION_EMAIL" ]; then
    echo -e "Notification Email: $NOTIFICATION_EMAIL"
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
        GitHubOwner=$GITHUB_OWNER \
        GitHubRepo=$GITHUB_REPO \
        GitHubBranch=$GITHUB_BRANCH \
        GitHubToken=$GITHUB_TOKEN \
        Environment=$ENVIRONMENT \
        NotificationEmail=$NOTIFICATION_EMAIL \
        DefaultCacheTTL=$DEFAULT_CACHE_TTL \
        WebsiteSourcePath=$WEBSITE_SOURCE_PATH \
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
    PIPELINE_NAME=$(echo $OUTPUTS | jq -r '.[] | select(.OutputKey=="PipelineName") | .OutputValue')
    PIPELINE_URL=$(echo $OUTPUTS | jq -r '.[] | select(.OutputKey=="PipelineConsoleURL") | .OutputValue')
    
    echo -e "${GREEN}Deployment Information:${NC}"
    echo -e "S3 Bucket: $BUCKET_NAME"
    echo -e "CloudFront Distribution ID: $CLOUDFRONT_ID"
    echo -e "CloudFront Domain: $CLOUDFRONT_DOMAIN"
    echo -e "Website URL: $WEBSITE_URL"
    echo -e "CI/CD Pipeline: $PIPELINE_NAME"
    echo -e "Pipeline Console URL: $PIPELINE_URL"
    
    echo -e "${GREEN}Deployment complete!${NC}"
    echo -e "Your website infrastructure is now set up with CI/CD pipeline."
    echo -e "The pipeline will automatically deploy your website when changes are pushed to the $GITHUB_BRANCH branch."
    
    if [ "$CREATE_DNS_RECORDS" = "true" ]; then
        echo -e "${YELLOW}Note: DNS propagation may take some time. Your website will be available at https://$DOMAIN_NAME once DNS propagates.${NC}"
    fi
else
    echo -e "${RED}Error: CloudFormation stack deployment failed.${NC}"
    exit 1
fi
