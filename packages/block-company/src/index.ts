// Block factory and metadata
export { createCompanyBlock, companyBlockMetadata } from './lib/company.block';
export type { CompanyBlock, CompanyBlockConfig } from './lib/company.block';

// Types
export type {
  // Company types
  Company,
  CreateCompanyRequest,
  UpdateCompanyRequest,
  ListCompaniesParams,
  // Department types
  Department,
  DepartmentHierarchy,
  CreateDepartmentRequest,
  UpdateDepartmentRequest,
  ListDepartmentsParams,
  // Team types
  Team,
  CreateTeamRequest,
  UpdateTeamRequest,
  ListTeamsParams,
  // TeamMember types
  TeamMember,
  AddTeamMemberRequest,
  UpdateTeamMemberRequest,
  ListTeamMembersParams,
  // Quarter types
  Quarter,
  CreateQuarterRequest,
  UpdateQuarterRequest,
  ListQuartersParams,
} from './lib/types';

// Services
export type {
  CompaniesService,
  DepartmentsService,
  TeamsService,
  TeamMembersService,
  QuartersService,
} from './lib/services';

export {
  createCompaniesService,
  createDepartmentsService,
  createTeamsService,
  createTeamMembersService,
  createQuartersService,
} from './lib/services';

// Mappers (for advanced use cases)
export {
  companyMapper,
  departmentMapper,
  teamMapper,
  teamMemberMapper,
  quarterMapper,
} from './lib/mappers';
