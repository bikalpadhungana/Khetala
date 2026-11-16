const { PrismaClient } = require('../../generated-client');
const prisma = new PrismaClient();

class CareerRepository {
  async createJobPosting(data) {
    return prisma.jobPosting.create({
      data,
    });
  }

  async getAllJobPostings(filters = {}) {
    return prisma.jobPosting.findMany({
      where: filters,
      orderBy: { createdAt: 'desc' },
    });
  }

  async getJobPostingById(id) {
    return prisma.jobPosting.findUnique({
      where: { id },
    });
  }

  async updateJobPosting(id, data) {
    return prisma.jobPosting.update({
      where: { id },
      data,
    });
  }

  async deleteJobPosting(id) {
    return prisma.jobPosting.delete({
      where: { id },
    });
  }

  async createJobApplication(data) {
    return prisma.jobApplication.create({
      data,
    });
  }

  async getAllJobApplications(filters = {}) {
    return prisma.jobApplication.findMany({
      where: filters,
      include: {
        job: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async updateJobApplication(id, data) {
    return prisma.jobApplication.update({
      where: { id },
      data,
    });
  }
}

module.exports = new CareerRepository();
