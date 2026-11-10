import { Controller, Get, Post, Param, Body } from '@nestjs/common';
import { CertificatesService } from './certificates.service';

@Controller('certificates')
export class CertificatesController {
  constructor(private readonly certificatesService: CertificatesService) {}

  @Get('user/:userId')
  async getUserCertificates(@Param('userId') userId: string) {
    return this.certificatesService.getUserCertificates(userId);
  }

  @Get(':idOrNumber')
  async getCertificate(@Param('idOrNumber') idOrNumber: string) {
    return this.certificatesService.getCertificateByIdOrNumber(idOrNumber);
  }

  @Post('claim/:competitionId')
  async claimCertificate(
    @Param('competitionId') competitionId: string,
    @Body('userId') userId: string,
  ) {
    return this.certificatesService.issueCertificate(userId, competitionId);
  }
}
