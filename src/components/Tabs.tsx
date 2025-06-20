import { type ReactNode } from 'react';
import { Tabs as BaseTabs } from '@base-ui-components/react/tabs';
import { type LucideIcon } from 'lucide-react';

interface TabItem {
  value: string;
  label: string;
  icon: LucideIcon;
}

interface TabsProps {
  value: string;
  onValueChange: (value: string) => void;
  tabs: TabItem[];
  children: ReactNode;
  className?: string;
}

const Tabs = ({ value, onValueChange, tabs, children, className = '' }: TabsProps) => {
  return (
    <BaseTabs.Root 
      value={value} 
      onValueChange={onValueChange} 
      className={`rounded-md border border-gray-600 ${className}`}
    >
      <BaseTabs.List className="relative z-0 flex gap-1 px-1 shadow-[inset_0_-1px] shadow-gray-600">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <BaseTabs.Tab
              key={tab.value}
              value={tab.value}
              className="flex h-8 items-center justify-center gap-2 border-0 px-2 text-sm font-medium text-gray-400 outline-none select-none before:inset-x-0 before:inset-y-1 before:rounded-sm before:-outline-offset-1 before:outline-blue-400 hover:text-gray-100 focus-visible:relative focus-visible:before:absolute focus-visible:before:outline focus-visible:before:outline-2 data-[selected]:text-gray-100"
            >
              <Icon size={16} />
              {tab.label}
            </BaseTabs.Tab>
          );
        })}
        <BaseTabs.Indicator className="absolute top-1/2 left-0 z-[-1] h-6 w-[var(--active-tab-width)] -translate-y-1/2 translate-x-[var(--active-tab-left)] rounded-sm bg-gray-700 transition-all duration-200 ease-in-out" />
      </BaseTabs.List>
      {children}
    </BaseTabs.Root>
  );
};

interface TabPanelProps {
  value: string;
  children: ReactNode;
  className?: string;
}

const TabPanel = ({ value, children, className = '' }: TabPanelProps) => {
  return (
    <BaseTabs.Panel 
      value={value} 
      className={`relative -outline-offset-1 outline-blue-400 focus-visible:rounded-md focus-visible:outline focus-visible:outline-2 ${className}`}
    >
      {children}
    </BaseTabs.Panel>
  );
};

export { Tabs, TabPanel, type TabItem, type TabsProps, type TabPanelProps };