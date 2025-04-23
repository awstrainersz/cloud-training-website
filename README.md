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

## Directory Structure

```
cloud-training-website/
├── infrastructure/           # AWS infrastructure code
│   ├── cloudformation-template.yaml  # CloudFormation template
│   └── deploy.sh             # Deployment script
├── src/                      # Website source files
│   ├── css/                  # Stylesheets
│   ├── js/                   # JavaScript files
│   ├── images/               # Image assets
│   ├── pages/                # HTML pages
│   └── index.html            # Homepage
└── README.md                 # Project documentation
```

## Getting Started

### Prerequisites

- AWS CLI installed and configured
- Access to an AWS account with appropriate permissions
- (Optional) A registered domain name
- (Optional) A Route 53 hosted zone for your domain

### Deployment

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

## Customization

### Content

- Edit the HTML files in `src/` and `src/pages/` to update content
- Replace images in `src/images/` with your own
- Update contact information and social media links

### Styling

- Modify `src/css/styles.css` to customize the look and feel
- The website uses a responsive design that works on all device sizes

### Infrastructure

- Edit `infrastructure/cloudformation-template.yaml` to modify the AWS resources
- Update `infrastructure/deploy.sh` for custom deployment options

## Development

For local development:

1. Make changes to files in the `src/` directory
2. Test locally by opening `src/index.html` in a web browser
3. Deploy changes using the deployment script

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contact

For questions or support, please contact:
- Email: your-email@example.com
- GitHub: [Your GitHub Profile](https://github.com/yourusername)
