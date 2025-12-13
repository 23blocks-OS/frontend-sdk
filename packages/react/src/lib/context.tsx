import { createContext, useContext, useMemo, type ReactNode } from 'react';
import type { Transport, BlockConfig } from '@23blocks/contracts';
import { createAuthenticationBlock, type AuthenticationBlock, type AuthenticationBlockConfig } from '@23blocks/block-authentication';
import { createSearchBlock, type SearchBlock, type SearchBlockConfig } from '@23blocks/block-search';
import { createProductsBlock, type ProductsBlock, type ProductsBlockConfig } from '@23blocks/block-products';
import { createCrmBlock, type CrmBlock, type CrmBlockConfig } from '@23blocks/block-crm';
import { createContentBlock, type ContentBlock, type ContentBlockConfig } from '@23blocks/block-content';
import { createGeolocationBlock, type GeolocationBlock, type GeolocationBlockConfig } from '@23blocks/block-geolocation';
import { createConversationsBlock, type ConversationsBlock, type ConversationsBlockConfig } from '@23blocks/block-conversations';
import { createFilesBlock, type FilesBlock, type FilesBlockConfig } from '@23blocks/block-files';
import { createFormsBlock, type FormsBlock, type FormsBlockConfig } from '@23blocks/block-forms';
import { createAssetsBlock, type AssetsBlock, type AssetsBlockConfig } from '@23blocks/block-assets';
import { createCampaignsBlock, type CampaignsBlock, type CampaignsBlockConfig } from '@23blocks/block-campaigns';
import { createCompanyBlock, type CompanyBlock, type CompanyBlockConfig } from '@23blocks/block-company';
import { createRewardsBlock, type RewardsBlock, type RewardsBlockConfig } from '@23blocks/block-rewards';
import { createSalesBlock, type SalesBlock, type SalesBlockConfig } from '@23blocks/block-sales';
import { createWalletBlock, type WalletBlock, type WalletBlockConfig } from '@23blocks/block-wallet';
import { createJarvisBlock, type JarvisBlock, type JarvisBlockConfig } from '@23blocks/block-jarvis';
import { createOnboardingBlock, type OnboardingBlock, type OnboardingBlockConfig } from '@23blocks/block-onboarding';
import { createUniversityBlock, type UniversityBlock, type UniversityBlockConfig } from '@23blocks/block-university';

// ─────────────────────────────────────────────────────────────────────────────
// Context Types
// ─────────────────────────────────────────────────────────────────────────────

export interface Blocks23Context {
  transport: Transport;
  authentication: AuthenticationBlock | null;
  search: SearchBlock | null;
  products: ProductsBlock | null;
  crm: CrmBlock | null;
  content: ContentBlock | null;
  geolocation: GeolocationBlock | null;
  conversations: ConversationsBlock | null;
  files: FilesBlock | null;
  forms: FormsBlock | null;
  assets: AssetsBlock | null;
  campaigns: CampaignsBlock | null;
  company: CompanyBlock | null;
  rewards: RewardsBlock | null;
  sales: SalesBlock | null;
  wallet: WalletBlock | null;
  jarvis: JarvisBlock | null;
  onboarding: OnboardingBlock | null;
  university: UniversityBlock | null;
}

// ─────────────────────────────────────────────────────────────────────────────
// Context
// ─────────────────────────────────────────────────────────────────────────────

const Blocks23ContextInternal = createContext<Blocks23Context | null>(null);

// ─────────────────────────────────────────────────────────────────────────────
// Provider Props
// ─────────────────────────────────────────────────────────────────────────────

export interface Blocks23ProviderProps {
  children: ReactNode;
  transport: Transport;
  authentication?: AuthenticationBlockConfig;
  search?: SearchBlockConfig;
  products?: ProductsBlockConfig;
  crm?: CrmBlockConfig;
  content?: ContentBlockConfig;
  geolocation?: GeolocationBlockConfig;
  conversations?: ConversationsBlockConfig;
  files?: FilesBlockConfig;
  forms?: FormsBlockConfig;
  assets?: AssetsBlockConfig;
  campaigns?: CampaignsBlockConfig;
  company?: CompanyBlockConfig;
  rewards?: RewardsBlockConfig;
  sales?: SalesBlockConfig;
  wallet?: WalletBlockConfig;
  jarvis?: JarvisBlockConfig;
  onboarding?: OnboardingBlockConfig;
  university?: UniversityBlockConfig;
}

// ─────────────────────────────────────────────────────────────────────────────
// Provider Component
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Provider component for 23blocks services.
 *
 * @example
 * ```tsx
 * import { Blocks23Provider } from '@23blocks/react';
 * import { createHttpTransport } from '@23blocks/transport-http';
 *
 * const transport = createHttpTransport({
 *   baseUrl: 'https://api.example.com',
 *   headers: () => ({
 *     'Authorization': `Bearer ${localStorage.getItem('token')}`,
 *   }),
 * });
 *
 * function App() {
 *   return (
 *     <Blocks23Provider
 *       transport={transport}
 *       authentication={{ appId: 'my-app' }}
 *       search={{ appId: 'my-app' }}
 *       products={{ appId: 'my-app' }}
 *       crm={{ appId: 'my-app' }}
 *     >
 *       <MyApp />
 *     </Blocks23Provider>
 *   );
 * }
 * ```
 */
export function Blocks23Provider({
  children,
  transport,
  authentication,
  search,
  products,
  crm,
  content,
  geolocation,
  conversations,
  files,
  forms,
  assets,
  campaigns,
  company,
  rewards,
  sales,
  wallet,
  jarvis,
  onboarding,
  university,
}: Blocks23ProviderProps) {
  const value = useMemo<Blocks23Context>(() => ({
    transport,
    authentication: authentication ? createAuthenticationBlock(transport, authentication) : null,
    search: search ? createSearchBlock(transport, search) : null,
    products: products ? createProductsBlock(transport, products) : null,
    crm: crm ? createCrmBlock(transport, crm) : null,
    content: content ? createContentBlock(transport, content) : null,
    geolocation: geolocation ? createGeolocationBlock(transport, geolocation) : null,
    conversations: conversations ? createConversationsBlock(transport, conversations) : null,
    files: files ? createFilesBlock(transport, files) : null,
    forms: forms ? createFormsBlock(transport, forms) : null,
    assets: assets ? createAssetsBlock(transport, assets) : null,
    campaigns: campaigns ? createCampaignsBlock(transport, campaigns) : null,
    company: company ? createCompanyBlock(transport, company) : null,
    rewards: rewards ? createRewardsBlock(transport, rewards) : null,
    sales: sales ? createSalesBlock(transport, sales) : null,
    wallet: wallet ? createWalletBlock(transport, wallet) : null,
    jarvis: jarvis ? createJarvisBlock(transport, jarvis) : null,
    onboarding: onboarding ? createOnboardingBlock(transport, onboarding) : null,
    university: university ? createUniversityBlock(transport, university) : null,
  }), [transport, authentication, search, products, crm, content, geolocation, conversations, files, forms, assets, campaigns, company, rewards, sales, wallet, jarvis, onboarding, university]);

  return (
    <Blocks23ContextInternal.Provider value={value}>
      {children}
    </Blocks23ContextInternal.Provider>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Context Hook
// ─────────────────────────────────────────────────────────────────────────────

export function use23Blocks(): Blocks23Context {
  const context = useContext(Blocks23ContextInternal);
  if (!context) {
    throw new Error('use23Blocks must be used within a Blocks23Provider');
  }
  return context;
}

// ─────────────────────────────────────────────────────────────────────────────
// Block-specific hooks
// ─────────────────────────────────────────────────────────────────────────────

export function useAuthenticationBlock(): AuthenticationBlock {
  const { authentication } = use23Blocks();
  if (!authentication) throw new Error('Authentication block not configured. Pass `authentication` prop to Blocks23Provider.');
  return authentication;
}

export function useSearchBlock(): SearchBlock {
  const { search } = use23Blocks();
  if (!search) throw new Error('Search block not configured. Pass `search` prop to Blocks23Provider.');
  return search;
}

export function useProductsBlock(): ProductsBlock {
  const { products } = use23Blocks();
  if (!products) throw new Error('Products block not configured. Pass `products` prop to Blocks23Provider.');
  return products;
}

export function useCrmBlock(): CrmBlock {
  const { crm } = use23Blocks();
  if (!crm) throw new Error('CRM block not configured. Pass `crm` prop to Blocks23Provider.');
  return crm;
}

export function useContentBlock(): ContentBlock {
  const { content } = use23Blocks();
  if (!content) throw new Error('Content block not configured. Pass `content` prop to Blocks23Provider.');
  return content;
}

export function useGeolocationBlock(): GeolocationBlock {
  const { geolocation } = use23Blocks();
  if (!geolocation) throw new Error('Geolocation block not configured. Pass `geolocation` prop to Blocks23Provider.');
  return geolocation;
}

export function useConversationsBlock(): ConversationsBlock {
  const { conversations } = use23Blocks();
  if (!conversations) throw new Error('Conversations block not configured. Pass `conversations` prop to Blocks23Provider.');
  return conversations;
}

export function useFilesBlock(): FilesBlock {
  const { files } = use23Blocks();
  if (!files) throw new Error('Files block not configured. Pass `files` prop to Blocks23Provider.');
  return files;
}

export function useFormsBlock(): FormsBlock {
  const { forms } = use23Blocks();
  if (!forms) throw new Error('Forms block not configured. Pass `forms` prop to Blocks23Provider.');
  return forms;
}

export function useAssetsBlock(): AssetsBlock {
  const { assets } = use23Blocks();
  if (!assets) throw new Error('Assets block not configured. Pass `assets` prop to Blocks23Provider.');
  return assets;
}

export function useCampaignsBlock(): CampaignsBlock {
  const { campaigns } = use23Blocks();
  if (!campaigns) throw new Error('Campaigns block not configured. Pass `campaigns` prop to Blocks23Provider.');
  return campaigns;
}

export function useCompanyBlock(): CompanyBlock {
  const { company } = use23Blocks();
  if (!company) throw new Error('Company block not configured. Pass `company` prop to Blocks23Provider.');
  return company;
}

export function useRewardsBlock(): RewardsBlock {
  const { rewards } = use23Blocks();
  if (!rewards) throw new Error('Rewards block not configured. Pass `rewards` prop to Blocks23Provider.');
  return rewards;
}

export function useSalesBlock(): SalesBlock {
  const { sales } = use23Blocks();
  if (!sales) throw new Error('Sales block not configured. Pass `sales` prop to Blocks23Provider.');
  return sales;
}

export function useWalletBlock(): WalletBlock {
  const { wallet } = use23Blocks();
  if (!wallet) throw new Error('Wallet block not configured. Pass `wallet` prop to Blocks23Provider.');
  return wallet;
}

export function useJarvisBlock(): JarvisBlock {
  const { jarvis } = use23Blocks();
  if (!jarvis) throw new Error('Jarvis block not configured. Pass `jarvis` prop to Blocks23Provider.');
  return jarvis;
}

export function useOnboardingBlock(): OnboardingBlock {
  const { onboarding } = use23Blocks();
  if (!onboarding) throw new Error('Onboarding block not configured. Pass `onboarding` prop to Blocks23Provider.');
  return onboarding;
}

export function useUniversityBlock(): UniversityBlock {
  const { university } = use23Blocks();
  if (!university) throw new Error('University block not configured. Pass `university` prop to Blocks23Provider.');
  return university;
}
