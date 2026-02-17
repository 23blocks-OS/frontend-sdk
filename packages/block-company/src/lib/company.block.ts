import type { Transport, BlockConfig, BlockMetadata, HealthCheckResponse } from '@23blocks/contracts';
import {
  createCompaniesService,
  createDepartmentsService,
  createTeamsService,
  createTeamMembersService,
  createQuartersService,
  createPositionsService,
  createEmployeeAssignmentsService,
  type CompaniesService,
  type DepartmentsService,
  type TeamsService,
  type TeamMembersService,
  type QuartersService,
  type PositionsService,
  type EmployeeAssignmentsService,
} from './services/index.js';

/**
 * Configuration for the Company block.
 */
export interface CompanyBlockConfig extends BlockConfig {
  /** Application ID */
  appId: string;
  /** Tenant ID (optional, for multi-tenant setups) */
  tenantId?: string;
}

/**
 * Company organizational structure block interface.
 */
export interface CompanyBlock {
  /** Company CRUD operations */
  companies: CompaniesService;
  /** Department management */
  departments: DepartmentsService;
  /** Team management */
  teams: TeamsService;
  /** Team member management */
  teamMembers: TeamMembersService;
  /** Quarterly period management */
  quarters: QuartersService;
  /** Position/role definition management */
  positions: PositionsService;
  /** Employee-to-position assignment management */
  employeeAssignments: EmployeeAssignmentsService;
  /** Ping the service health endpoint */
  health(): Promise<HealthCheckResponse>;
}

/**
 * Create the Company block.
 *
 * @example
 * ```typescript
 * const block = createCompanyBlock(transport, { appId: 'xxx' });
 * const companies = await block.companies.list({ page: 1 });
 * ```
 */
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
    positions: createPositionsService(transport, config),
    employeeAssignments: createEmployeeAssignmentsService(transport, config),
    health: () => transport.get<HealthCheckResponse>('/health'),
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
    'Position',
    'EmployeeAssignment',
  ],
};
