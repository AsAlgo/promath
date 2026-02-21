import {
  BreadcrumbNav,
  type BreadcrumbItem,
} from '@/components/nav/breadcrumb-nav';
import { GradePicker } from '@/components/nav/grade-picker';

interface SubNavProps {
  breadcrumbs: BreadcrumbItem[];
  children?: React.ReactNode;
}

export function SubNav({ breadcrumbs, children }: SubNavProps) {
  return (
    <div>
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <BreadcrumbNav items={breadcrumbs} />
        <div className="hidden sm:block pr-6">
          <GradePicker compact />
        </div>
      </div>
      {children}
    </div>
  );
}
