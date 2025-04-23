# CloudMasters - Cloud Training & Consulting Website

This repository contains the source code and infrastructure for the CloudMasters static website, which showcases cloud training, consulting, and FinOps services.

## Project Overview

CloudMasters is a professional website for a cloud training and consulting company, featuring:

- Comprehensive information about cloud training programs (AWS, GCP, Azure, DevOps, AI)
- Cloud consulting and development services
- FinOps and cloud cost optimization expertise
- Project showcases and case studies
- Blog and resources section
- Contact and inquiry forms

## Technical Architecture

The website is built as a static site hosted on AWS with the following components:

- **Amazon S3**: Hosts the static website files
- **Amazon CloudFront**: Content delivery network for global distribution and HTTPS
- **AWS Certificate Manager**: Provides SSL/TLS certificate
- **Amazon Route 53** (optional): DNS management
- **AWS CodePipeline**: CI/CD pipeline for automated deployments
- **AWS CodeBuild**: Builds and deploys the website
- **GitHub Webhooks**: Triggers the pipeline on code changes

## Directory Structure

```
cloud-training-website/
├── infrastructure/                      # AWS infrastructure code
│   ├── cloudformation-template.yaml     # Basic CloudFormation template
│   ├── cloudformation-template-cicd.yaml # CloudFormation with CI/CD pipeline
│   ├── deploy.sh                        # Basic deployment script
│   ├── deploy-cicd.sh                   # CI/CD deployment script
│   └── parameters-example.json          # Example parameters file
├── src/                                 # Website source files
│   ├── css/                             # Stylesheets
│   ├── js/                              # JavaScript files
│   ├── images/                          # Image assets
│   ├── pages/                           # HTML pages
│   └── index.html                       # Homepage
└── README.md                            # Project documentation
```

## Getting Started

### Prerequisites

- AWS CLI installed and configured
- Access to an AWS account with appropriate permissions
- GitHub repository for your code
- GitHub personal access token with repo scope
- (Optional) A registered domain name
- (Optional) A Route 53 hosted zone for your domain

### Deployment Options

#### Option 1: Basic Deployment (Manual Updates)

1. Clone this repository:
   ```
   git clone https://github.com/yourusername/cloud-training-website.git
   cd cloud-training-website
   ```

2. Deploy the infrastructure:
   ```
   cd infrastructure
   chmod +x deploy.sh
   ./deploy.sh --domain yourdomain.com --hosted-zone YOUR_HOSTED_ZONE_ID
   ```

   If you don't want to create DNS records:
   ```
   ./deploy.sh --domain yourdomain.com --no-dns
   ```

3. The script will:
   - Deploy the CloudFormation stack
   - Upload the website files to S3
   - Invalidate the CloudFront cache
   - Output the website URL

#### Option 2: CI/CD Deployment (Automated Updates)

1. Clone this repository:
   ```
   git clone https://github.com/yourusername/cloud-training-website.git
   cd cloud-training-website
   ```

2. Deploy the infrastructure with CI/CD pipeline:
   ```
   cd infrastructure
   chmod +x deploy-cicd.sh
   ./deploy-cicd.sh \
     --domain yourdomain.com \
     --hosted-zone YOUR_HOSTED_ZONE_ID \
     --github-owner your-github-username \
     --github-repo cloud-training-website \
     --github-token your-github-token \
     --notification-email your-email@example.com
   ```

3. The script will:
   - Deploy the CloudFormation stack with CI/CD pipeline
   - Set up GitHub webhook for automatic deployments
   - Configure notifications for pipeline events
   - Output the website URL and pipeline information

4. After deployment, any changes pushed to the specified GitHub branch will automatically trigger the pipeline to update the website.

Alternatively, you can use CloudFormation parameters file:

1. Copy the example parameters file:
   ```bash
   cp parameters-example.json parameters.json
   ```

2. Edit the parameters.json file with your values

3. Deploy using AWS CLI:
   ```bash
   aws cloudformation deploy \
     --template-file cloudformation-template-cicd.yaml \
     --stack-name cloud-training-website \
     --parameter-overrides file://parameters.json \
     --capabilities CAPABILITY_IAM
   ```

## Customization

### Content

- Edit the HTML files in `src/` and `src/pages/` to update content
- Replace images in `src/images/` with your own
- Update contact information and social media links

### Styling

- Modify `src/css/styles.css` to customize the look and feel
- The website uses a responsive design that works on all device sizes

### Infrastructure

- Edit the CloudFormation templates to modify the AWS resources
- Update the deployment scripts for custom deployment options

### CI/CD Pipeline

- Modify the environment variables in the CloudFormation template to customize the build process
- Adjust the BuildSpec in the CodeBuild project to change the build steps
- Configure additional pipeline stages as needed

## Development

For local development:

1. Make changes to files in the `src/` directory
2. Test locally by opening `src/index.html` in a web browser
3. Commit and push changes to GitHub to trigger the CI/CD pipeline (if using CI/CD deployment)

## Environment Configuration

The CI/CD deployment supports different environments:

- **dev**: Development environment
- **test**: Testing environment
- **staging**: Staging environment
- **prod**: Production environment

You can specify the environment using the `--environment` parameter:

```bash
./deploy-cicd.sh --environment dev [other parameters]
```

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contact

For questions or support, please contact:
- Email: your-email@example.com
- GitHub: [Your GitHub Profile](https://github.com/yourusername)
