# UI Patterns Reference

常用交互模式的标准实现方式。

## 1. 列表模式 (List Pattern)

### 何时使用

- 展示多条数据
- 需要筛选/搜索/分页

### 标准结构

```typescript
// apps/web/src/features/[feature]/components/List.tsx
import { useQuery } from '@tanstack/react-query'
import { apiClient } from '@/lib/api-client'

export function FeatureList() {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['features'],
    queryFn: () => apiClient.features.list()
  })

  // Loading State
  if (isLoading) {
    return <ListSkeleton count={5} />
  }

  // Error State
  if (error) {
    return (
      <ErrorState
        message={error.message}
        onRetry={refetch}
      />
    )
  }

  // Empty State
  if (!data?.length) {
    return (
      <EmptyState
        title="No items yet"
        description="Create your first item to get started"
        action={<CreateButton />}
      />
    )
  }

  // Success State
  return (
    <div className="divide-y">
      {data.map((item) => (
        <ListItem key={item.id} item={item} />
      ))}
    </div>
  )
}
```

### Mobile适配

```typescript
// apps/mobile/src/features/[feature]/components/List.tsx
import { FlatList, RefreshControl } from 'react-native'

export function FeatureList() {
  const { data, isLoading, error, refetch, isRefetching } = useQuery(...)

  return (
    <FlatList
      data={data}
      renderItem={({ item }) => <ListItem item={item} />}
      keyExtractor={(item) => item.id}
      refreshControl={
        <RefreshControl refreshing={isRefetching} onRefresh={refetch} />
      }
      ListEmptyComponent={<EmptyState />}
      ListFooterComponent={<LoadMore />}
    />
  )
}
```

---

## 2. 表单模式 (Form Pattern)

### 何时使用

- 创建/编辑数据
- 用户输入

### 标准结构

```typescript
// apps/web/src/features/[feature]/components/Form.tsx
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { FeatureSchema, type Feature } from '@repo/schemas'

interface Props {
  defaultValues?: Partial<Feature>
  onSubmit: (data: Feature) => Promise<void>
}

export function FeatureForm({ defaultValues, onSubmit }: Props) {
  const form = useForm<Feature>({
    resolver: zodResolver(FeatureSchema),
    defaultValues: {
      title: '',
      description: '',
      ...defaultValues
    }
  })

  const { isSubmitting, errors } = form.formState

  const handleSubmit = async (data: Feature) => {
    try {
      await onSubmit(data)
      toast.success('Saved successfully!')
    } catch (e) {
      toast.error('Failed to save')
    }
  }

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)}>
      {/* Title Field */}
      <div className="space-y-2">
        <label htmlFor="title">Title</label>
        <input
          id="title"
          {...form.register('title')}
          className={cn(errors.title && 'border-red-500')}
        />
        {errors.title && (
          <p className="text-red-500 text-sm">{errors.title.message}</p>
        )}
      </div>

      {/* Description Field */}
      <div className="space-y-2">
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          {...form.register('description')}
        />
      </div>

      {/* Submit Button */}
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Saving...' : 'Save'}
      </Button>
    </form>
  )
}
```

### 表单验证规则

```typescript
// packages/schemas/src/[feature].ts
export const FeatureFormSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(100, "Title must be less than 100 characters"),
  description: z
    .string()
    .max(500, "Description must be less than 500 characters")
    .optional(),
  email: z.string().email("Invalid email address"),
  url: z.string().url("Invalid URL").optional(),
});
```

---

## 3. 向导模式 (Wizard Pattern)

### 何时使用

- 多步骤流程
- 复杂表单
- 引导式体验

### 标准结构

```typescript
// apps/web/src/features/[feature]/components/Wizard.tsx
import { useState } from 'react'

type Step = 'info' | 'details' | 'review' | 'complete'

const STEPS: Step[] = ['info', 'details', 'review', 'complete']

export function FeatureWizard() {
  const [step, setStep] = useState<Step>('info')
  const [data, setData] = useState<Partial<FormData>>({})

  const currentIndex = STEPS.indexOf(step)
  const progress = ((currentIndex + 1) / STEPS.length) * 100

  const goNext = () => {
    const nextIndex = currentIndex + 1
    if (nextIndex < STEPS.length) {
      setStep(STEPS[nextIndex])
    }
  }

  const goBack = () => {
    const prevIndex = currentIndex - 1
    if (prevIndex >= 0) {
      setStep(STEPS[prevIndex])
    }
  }

  return (
    <div>
      {/* Progress Bar */}
      <div className="h-2 bg-gray-200 rounded">
        <div
          className="h-full bg-blue-500 rounded transition-all"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Step Indicator */}
      <div className="flex justify-between py-4">
        {STEPS.map((s, i) => (
          <div
            key={s}
            className={cn(
              'flex items-center',
              i <= currentIndex ? 'text-blue-500' : 'text-gray-400'
            )}
          >
            <span className="w-8 h-8 rounded-full border-2 flex items-center justify-center">
              {i + 1}
            </span>
            <span className="ml-2 capitalize">{s}</span>
          </div>
        ))}
      </div>

      {/* Step Content */}
      {step === 'info' && (
        <InfoStep
          data={data}
          onUpdate={(d) => setData({ ...data, ...d })}
          onNext={goNext}
        />
      )}
      {step === 'details' && (
        <DetailsStep
          data={data}
          onUpdate={(d) => setData({ ...data, ...d })}
          onNext={goNext}
          onBack={goBack}
        />
      )}
      {step === 'review' && (
        <ReviewStep
          data={data}
          onSubmit={handleSubmit}
          onBack={goBack}
        />
      )}
      {step === 'complete' && (
        <CompleteStep />
      )}
    </div>
  )
}
```

---

## 4. 详情页模式 (Detail Pattern)

### 何时使用

- 展示单条数据详情
- 需要操作按钮（编辑/删除）

### 标准结构

```typescript
// apps/web/src/features/[feature]/components/Detail.tsx
import { useParams, useRouter } from 'next/navigation'

export function FeatureDetail() {
  const { id } = useParams()
  const router = useRouter()

  const { data, isLoading, error } = useQuery({
    queryKey: ['feature', id],
    queryFn: () => apiClient.features.get(id)
  })

  const deleteMutation = useMutation({
    mutationFn: () => apiClient.features.delete(id),
    onSuccess: () => {
      toast.success('Deleted')
      router.push('/features')
    }
  })

  const handleDelete = () => {
    // 使用确认对话框
    if (confirm('Are you sure?')) {
      deleteMutation.mutate()
    }
  }

  if (isLoading) return <DetailSkeleton />
  if (error) return <ErrorState message={error.message} />
  if (!data) return <NotFound />

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1>{data.title}</h1>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={() => router.push(`/features/${id}/edit`)}>
            Edit
          </Button>
          <Button variant="destructive" onClick={handleDelete}>
            Delete
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="mt-6">
        <p>{data.description}</p>
        {/* More fields... */}
      </div>

      {/* Metadata */}
      <div className="mt-8 text-sm text-gray-500">
        <p>Created: {formatDate(data.createdAt)}</p>
        <p>Updated: {formatDate(data.updatedAt)}</p>
      </div>
    </div>
  )
}
```

---

## 5. 搜索模式 (Search Pattern)

### 标准实现

```typescript
// apps/web/src/features/[feature]/components/Search.tsx
import { useDebounce } from '@/hooks/useDebounce'

export function FeatureSearch() {
  const [query, setQuery] = useState('')
  const debouncedQuery = useDebounce(query, 300)

  const { data, isLoading } = useQuery({
    queryKey: ['features', 'search', debouncedQuery],
    queryFn: () => apiClient.features.search(debouncedQuery),
    enabled: debouncedQuery.length > 0
  })

  return (
    <div className="relative">
      <input
        type="search"
        placeholder="Search..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full pl-10 pr-4 py-2 border rounded-lg"
      />
      <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />

      {/* Results Dropdown */}
      {query && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border rounded-lg shadow-lg">
          {isLoading ? (
            <div className="p-4">Searching...</div>
          ) : data?.length ? (
            data.map((item) => (
              <SearchResult key={item.id} item={item} />
            ))
          ) : (
            <div className="p-4 text-gray-500">No results found</div>
          )}
        </div>
      )}
    </div>
  )
}
```

---

## 6. Modal/Dialog模式

### 何时使用

- 需要用户确认
- 简单表单
- 不想离开当前页面

### 标准实现

```typescript
// 使用shadcn/ui Dialog
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

export function ConfirmDeleteDialog({ onConfirm }: { onConfirm: () => void }) {
  const [open, setOpen] = useState(false)

  const handleConfirm = () => {
    onConfirm()
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="destructive">Delete</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you sure?</DialogTitle>
          <DialogDescription>
            This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="secondary" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleConfirm}>
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
```

---

## 7. Toast/Notification模式

### 标准使用

```typescript
// 使用react-hot-toast或sonner
import { toast } from "sonner";

// Success
toast.success("Item created successfully");

// Error
toast.error("Failed to save");

// With action
toast("Item deleted", {
  action: {
    label: "Undo",
    onClick: () => handleUndo(),
  },
});

// Promise (自动处理loading/success/error)
toast.promise(saveData(), {
  loading: "Saving...",
  success: "Saved!",
  error: "Failed to save",
});
```

---

## 8. 状态组件 (State Components)

### Loading Skeleton

```typescript
export function ListSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
          <div className="h-3 bg-gray-200 rounded w-1/2" />
        </div>
      ))}
    </div>
  )
}
```

### Empty State

```typescript
interface EmptyStateProps {
  title: string
  description?: string
  action?: React.ReactNode
}

export function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <EmptyIcon className="w-16 h-16 text-gray-300 mb-4" />
      <h3 className="text-lg font-medium text-gray-900">{title}</h3>
      {description && (
        <p className="mt-1 text-gray-500">{description}</p>
      )}
      {action && <div className="mt-4">{action}</div>}
    </div>
  )
}
```

### Error State

```typescript
interface ErrorStateProps {
  message: string
  onRetry?: () => void
}

export function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <ErrorIcon className="w-16 h-16 text-red-300 mb-4" />
      <h3 className="text-lg font-medium text-red-900">Something went wrong</h3>
      <p className="mt-1 text-red-600">{message}</p>
      {onRetry && (
        <Button variant="secondary" onClick={onRetry} className="mt-4">
          Try again
        </Button>
      )}
    </div>
  )
}
```

---

## 选择指南

| 场景              | 推荐模式       |
| ----------------- | -------------- |
| 展示多条数据      | List Pattern   |
| 创建/编辑单条数据 | Form Pattern   |
| 多步骤流程        | Wizard Pattern |
| 展示单条数据      | Detail Pattern |
| 快速查找          | Search Pattern |
| 简单确认/输入     | Modal Pattern  |
| 操作反馈          | Toast Pattern  |
