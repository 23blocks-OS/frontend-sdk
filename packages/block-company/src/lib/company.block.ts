import type { Transport, BlockConfig, BlockMetadata } from '@23blocks/contracts';
import {
  createCompaniesService,
  createDepartmentsService,
  createTeamsService,
  createTeamMembersService,
  createQuartersService,
  type CompaniesService,
  type DepartmentsService,
  type TeamsService,
  type TeamMembersService,
  type QuartersService,
} from './services';

export interface CompanyBlockConfig extends BlockConfig {
  appId: string;
  tenantId?: string;
}

export interface CompanyBlock {
  companies: CompaniesService;
  departments: DepartmentsService;
  teams: TeamsService;
  teamMembers: TeamMembersService;
  quarters: QuartersService;
}

export function createCompanyBlock(
  transport: Transport,
  config: CompanyBlockConfig
): CompanyBlock {
  return {
    companies: createCompaniesService(transport, config),
    departments: createDepartmentsService(transport, config),
    teams: createTeamsService(transport, config),
    teamMembers: createTeamMembersService(transport, config),
    quarters: createQuartersService(transport, config),
  };
}

export const companyBlockMetadata: BlockMetadata = {
  name: 'company',
  version: '0.1.0',
  description: 'Company organizational structure, departments, teams, and quarters',
  resourceTypes: [
    'Company',
    'Department',
    'Team',
    'TeamMember',
    'Quarter',
  ],
};
