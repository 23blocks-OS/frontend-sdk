# @23blocks/block-company

Company block for the 23blocks SDK - company settings, departments, teams, and organizational structure.

[![npm version](https://img.shields.io/npm/v/@23blocks/block-company.svg)](https://www.npmjs.com/package/@23blocks/block-company)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Installation

```bash
npm install @23blocks/block-company @23blocks/transport-http
```

## Overview

This package provides company and organizational management functionality including:

- **Companies** - Company settings and configuration
- **Departments** - Department hierarchy management
- **Teams** - Team management
- **Team Members** - Team membership management
- **Quarters** - Fiscal quarters and planning periods

## Quick Start

```typescript
import { createHttpTransport } from '@23blocks/transport-http';
import { createCompanyBlock } from '@23blocks/block-company';

const transport = createHttpTransport({
  baseUrl: 'https://api.yourapp.com',
  headers: () => {
    const token = localStorage.getItem('access_token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  },
});

const company = createCompanyBlock(transport, {
  apiKey: 'your-api-key',
});

// Get current company
const currentCompany = await company.companies.getCurrent();
console.log(currentCompany.name, currentCompany.domain);

// List departments
const { data: departments } = await company.departments.list();
```

## Services

### companies - Company Management

```typescript
// List companies
const { data: companies } = await company.companies.list();

// Get company by ID
const companyData = await company.companies.get('company-id');

// Get current company
const current = await company.companies.getCurrent();

// Create company
const newCompany = await company.companies.create({
  name: 'Acme Corp',
  domain: 'acme.com',
  industry: 'Technology',
  size: '100-500',
  timezone: 'America/New_York',
});

// Update company
await company.companies.update('company-id', {
  name: 'Acme Corporation',
  settings: {
    brandColor: '#0066cc',
  },
});

// Delete company
await company.companies.delete('company-id');
```

### departments - Department Management

```typescript
// List departments
const { data: departments } = await company.departments.list({
  companyId: 'company-id',
});

// Get department by ID
const department = await company.departments.get('department-id');

// Get department hierarchy
const hierarchy = await company.departments.getHierarchy('company-id');

// Create department
const newDepartment = await company.departments.create({
  companyId: 'company-id',
  name: 'Engineering',
  code: 'ENG',
  parentId: null, // Top-level department
  managerId: 'user-id',
});

// Update department
await company.departments.update('department-id', {
  name: 'Software Engineering',
  managerId: 'new-manager-id',
});

// Delete department
await company.departments.delete('department-id');
```

### teams - Team Management

```typescript
// List teams
const { data: teams } = await company.teams.list({
  departmentId: 'department-id',
});

// Get team by ID
const team = await company.teams.get('team-id');

// Create team
const newTeam = await company.teams.create({
  departmentId: 'department-id',
  name: 'Backend Team',
  description: 'API and infrastructure development',
  leadId: 'user-id',
});

// Update team
await company.teams.update('team-id', {
  name: 'Platform Team',
  leadId: 'new-lead-id',
});

// Delete team
await company.teams.delete('team-id');
```

### teamMembers - Team Member Management

```typescript
// List team members
const { data: members } = await company.teamMembers.list({
  teamId: 'team-id',
});

// Get member by ID
const member = await company.teamMembers.get('member-id');

// Add team member
const newMember = await company.teamMembers.add({
  teamId: 'team-id',
  userId: 'user-id',
  role: 'developer',
  startDate: '2024-01-15',
});

// Update team member
await company.teamMembers.update('member-id', {
  role: 'senior_developer',
});

// Remove team member
await company.teamMembers.remove('member-id');
```

### quarters - Quarter Management

```typescript
// List quarters
const { data: quarters } = await company.quarters.list({
  year: 2024,
});

// Get quarter by ID
const quarter = await company.quarters.get('quarter-id');

// Get current quarter
const currentQuarter = await company.quarters.getCurrent();

// Create quarter
const newQuarter = await company.quarters.create({
  companyId: 'company-id',
  name: 'Q1 2024',
  year: 2024,
  quarter: 1,
  startDate: '2024-01-01',
  endDate: '2024-03-31',
});

// Update quarter
await company.quarters.update('quarter-id', {
  goals: ['Launch v2.0', 'Expand to EU market'],
});

// Delete quarter
await company.quarters.delete('quarter-id');
```

## Types

```typescript
import type {
  Company,
  Department,
  DepartmentHierarchy,
  Team,
  TeamMember,
  Quarter,
  CreateCompanyRequest,
  CreateDepartmentRequest,
  CreateTeamRequest,
  AddTeamMemberRequest,
  CreateQuarterRequest,
} from '@23blocks/block-company';
```

### Company

| Property | Type | Description |
|----------|------|-------------|
| `id` | `string` | Company ID |
| `name` | `string` | Company name |
| `domain` | `string` | Company domain |
| `industry` | `string` | Industry sector |
| `size` | `string` | Company size range |
| `timezone` | `string` | Default timezone |
| `settings` | `object` | Company settings |

### Department

| Property | Type | Description |
|----------|------|-------------|
| `id` | `string` | Department ID |
| `name` | `string` | Department name |
| `code` | `string` | Department code |
| `parentId` | `string` | Parent department ID |
| `managerId` | `string` | Manager user ID |

### Team

| Property | Type | Description |
|----------|------|-------------|
| `id` | `string` | Team ID |
| `name` | `string` | Team name |
| `description` | `string` | Team description |
| `departmentId` | `string` | Parent department ID |
| `leadId` | `string` | Team lead user ID |

## Related Packages

- [`@23blocks/block-authentication`](https://www.npmjs.com/package/@23blocks/block-authentication) - User management
- [`@23blocks/angular`](https://www.npmjs.com/package/@23blocks/angular) - Angular integration
- [`@23blocks/react`](https://www.npmjs.com/package/@23blocks/react) - React integration
- [`@23blocks/sdk`](https://www.npmjs.com/package/@23blocks/sdk) - Full SDK package

## License

MIT - Copyright (c) 2024 23blocks
