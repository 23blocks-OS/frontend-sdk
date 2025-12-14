import { Injectable, Inject, Optional } from '@angular/core';
import { Observable, from } from 'rxjs';
import type { Transport, PageResult } from '@23blocks/contracts';
import {
  createCompanyBlock,
  type CompanyBlock,
  type CompanyBlockConfig,
  type Company,
  type CreateCompanyRequest,
  type UpdateCompanyRequest,
  type ListCompaniesParams,
  type Department,
  type DepartmentHierarchy,
  type CreateDepartmentRequest,
  type UpdateDepartmentRequest,
  type ListDepartmentsParams,
  type Team,
  type CreateTeamRequest,
  type UpdateTeamRequest,
  type ListTeamsParams,
  type TeamMember,
  type AddTeamMemberRequest,
  type UpdateTeamMemberRequest,
  type ListTeamMembersParams,
  type Quarter,
  type CreateQuarterRequest,
  type UpdateQuarterRequest,
  type ListQuartersParams,
} from '@23blocks/block-company';
import { TRANSPORT, COMPANY_TRANSPORT, COMPANY_CONFIG } from '../tokens.js';

/**
 * Angular service wrapping the Company block.
 * Converts Promise-based APIs to RxJS Observables.
 *
 * @example
 * ```typescript
 * @Component({...})
 * export class CompanyComponent {
 *   constructor(private company: CompanyService) {}
 *
 *   createCompany(name: string) {
 *     this.company.createCompany({ name, code: 'COMP001' }).subscribe({
 *       next: (company) => console.log('Company created:', company),
 *       error: (err) => console.error('Failed:', err),
 *     });
 *   }
 * }
 * ```
 */
@Injectable({ providedIn: 'root' })
export class CompanyService {
  private readonly block: CompanyBlock | null;

  constructor(
    @Optional() @Inject(COMPANY_TRANSPORT) serviceTransport: Transport | null,
    @Optional() @Inject(TRANSPORT) legacyTransport: Transport | null,
    @Inject(COMPANY_CONFIG) config: CompanyBlockConfig
  ) {
    const transport = serviceTransport ?? legacyTransport;
    this.block = transport ? createCompanyBlock(transport, config) : null;
  }

  /**
   * Ensure the service is configured, throw helpful error if not
   */
  private ensureConfigured(): CompanyBlock {
    if (!this.block) {
      throw new Error(
        '[23blocks] CompanyService is not configured. ' +
        "Add 'urls.company' to your provideBlocks23() configuration."
      );
    }
    return this.block;
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Companies Service
  // ─────────────────────────────────────────────────────────────────────────────

  listCompanies(params?: ListCompaniesParams): Observable<PageResult<Company>> {
    return from(this.ensureConfigured().companies.list(params));
  }

  getCompany(uniqueId: string): Observable<Company> {
    return from(this.ensureConfigured().companies.get(uniqueId));
  }

  createCompany(request: CreateCompanyRequest): Observable<Company> {
    return from(this.ensureConfigured().companies.create(request));
  }

  updateCompany(uniqueId: string, request: UpdateCompanyRequest): Observable<Company> {
    return from(this.ensureConfigured().companies.update(uniqueId, request));
  }

  deleteCompany(uniqueId: string): Observable<void> {
    return from(this.ensureConfigured().companies.delete(uniqueId));
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Departments Service
  // ─────────────────────────────────────────────────────────────────────────────

  listDepartments(params?: ListDepartmentsParams): Observable<PageResult<Department>> {
    return from(this.ensureConfigured().departments.list(params));
  }

  getDepartment(uniqueId: string): Observable<Department> {
    return from(this.ensureConfigured().departments.get(uniqueId));
  }

  createDepartment(request: CreateDepartmentRequest): Observable<Department> {
    return from(this.ensureConfigured().departments.create(request));
  }

  updateDepartment(uniqueId: string, request: UpdateDepartmentRequest): Observable<Department> {
    return from(this.ensureConfigured().departments.update(uniqueId, request));
  }

  deleteDepartment(uniqueId: string): Observable<void> {
    return from(this.ensureConfigured().departments.delete(uniqueId));
  }

  listDepartmentsByCompany(companyUniqueId: string): Observable<Department[]> {
    return from(this.ensureConfigured().departments.listByCompany(companyUniqueId));
  }

  getDepartmentHierarchy(companyUniqueId: string): Observable<DepartmentHierarchy[]> {
    return from(this.ensureConfigured().departments.getHierarchy(companyUniqueId));
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Teams Service
  // ─────────────────────────────────────────────────────────────────────────────

  listTeams(params?: ListTeamsParams): Observable<PageResult<Team>> {
    return from(this.ensureConfigured().teams.list(params));
  }

  getTeam(uniqueId: string): Observable<Team> {
    return from(this.ensureConfigured().teams.get(uniqueId));
  }

  createTeam(request: CreateTeamRequest): Observable<Team> {
    return from(this.ensureConfigured().teams.create(request));
  }

  updateTeam(uniqueId: string, request: UpdateTeamRequest): Observable<Team> {
    return from(this.ensureConfigured().teams.update(uniqueId, request));
  }

  deleteTeam(uniqueId: string): Observable<void> {
    return from(this.ensureConfigured().teams.delete(uniqueId));
  }

  listTeamsByDepartment(departmentUniqueId: string): Observable<Team[]> {
    return from(this.ensureConfigured().teams.listByDepartment(departmentUniqueId));
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Team Members Service
  // ─────────────────────────────────────────────────────────────────────────────

  listTeamMembers(params?: ListTeamMembersParams): Observable<PageResult<TeamMember>> {
    return from(this.ensureConfigured().teamMembers.list(params));
  }

  getTeamMember(uniqueId: string): Observable<TeamMember> {
    return from(this.ensureConfigured().teamMembers.get(uniqueId));
  }

  addTeamMember(request: AddTeamMemberRequest): Observable<TeamMember> {
    return from(this.ensureConfigured().teamMembers.add(request));
  }

  updateTeamMember(uniqueId: string, request: UpdateTeamMemberRequest): Observable<TeamMember> {
    return from(this.ensureConfigured().teamMembers.update(uniqueId, request));
  }

  removeTeamMember(uniqueId: string): Observable<void> {
    return from(this.ensureConfigured().teamMembers.remove(uniqueId));
  }

  listTeamMembersByTeam(teamUniqueId: string): Observable<TeamMember[]> {
    return from(this.ensureConfigured().teamMembers.listByTeam(teamUniqueId));
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Quarters Service
  // ─────────────────────────────────────────────────────────────────────────────

  listQuarters(params?: ListQuartersParams): Observable<PageResult<Quarter>> {
    return from(this.ensureConfigured().quarters.list(params));
  }

  getQuarter(uniqueId: string): Observable<Quarter> {
    return from(this.ensureConfigured().quarters.get(uniqueId));
  }

  createQuarter(request: CreateQuarterRequest): Observable<Quarter> {
    return from(this.ensureConfigured().quarters.create(request));
  }

  updateQuarter(uniqueId: string, request: UpdateQuarterRequest): Observable<Quarter> {
    return from(this.ensureConfigured().quarters.update(uniqueId, request));
  }

  deleteQuarter(uniqueId: string): Observable<void> {
    return from(this.ensureConfigured().quarters.delete(uniqueId));
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Direct Block Access (for advanced usage)
  // ─────────────────────────────────────────────────────────────────────────────

  /**
   * Access the underlying block for advanced operations
   * Use this when you need access to services not wrapped by this Angular service
   */
  get rawBlock(): CompanyBlock {
    return this.ensureConfigured();
  }
}
