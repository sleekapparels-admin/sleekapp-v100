# Modal & Dialog Components

<cite>
**Referenced Files in This Document**   
- [OrderDetailModal.tsx](file://src/components/admin/OrderDetailModal.tsx)
- [OrderDetailsDialog.tsx](file://src/components/admin/OrderDetailsDialog.tsx)
- [CreateSupplierOrderDialog.tsx](file://src/components/admin/CreateSupplierOrderDialog.tsx)
- [PerformanceReviewDialog.tsx](file://src/components/admin/PerformanceReviewDialog.tsx)
- [SupplierAssignmentDialog.tsx](file://src/components/admin/SupplierAssignmentDialog.tsx)
- [EmailQuoteModal.tsx](file://src/components/quote/EmailQuoteModal.tsx)
- [QuoteLoadingStages.tsx](file://src/components/quote/QuoteLoadingStages.tsx)
- [OrderDetailDialog.tsx](file://src/components/supplier/OrderDetailDialog.tsx)
- [SupplierOrderDetailModal.tsx](file://src/components/supplier/SupplierOrderDetailModal.tsx)
- [dialog.tsx](file://src/components/ui/dialog.tsx)
- [sheet.tsx](file://src/components/ui/sheet.tsx)
- [drawer.tsx](file://src/components/ui/drawer.tsx)
</cite>

## Table of Contents
1. [Introduction](#introduction)
2. [Core Modal & Dialog Components](#core-modal--dialog-components)
3. [Component Architecture](#component-architecture)
4. [Detailed Component Analysis](#detailed-component-analysis)
5. [Responsive Design & Accessibility](#responsive-design--accessibility)
6. [Styling & Theming](#styling--theming)
7. [Performance Considerations](#performance-considerations)
8. [Usage Examples](#usage-examples)
9. [Conclusion](#conclusion)

## Introduction
The sleekapp-v100 application features a comprehensive suite of modal and dialog components designed to provide rich user interactions across different user roles including administrators, suppliers, and buyers. These components are built on top of the shadcn/ui library, extending the base Dialog, Sheet, and Drawer components to create specialized interfaces for order management, supplier assignment, quote handling, and performance reviews. The modal system follows consistent design patterns while providing role-specific functionality, with careful attention to accessibility, responsive behavior, and user experience.

## Core Modal & Dialog Components
The application implements a diverse set of modal components tailored to specific workflows and user roles. These components share a common foundation but are specialized for their particular use cases, providing targeted functionality while maintaining a consistent user experience across the application.

### OrderDetailModal
The OrderDetailModal component provides administrators with a comprehensive view of order details, allowing them to manage pricing, assign suppliers, and add administrative notes. This modal features a multi-section layout with pricing calculations, supplier assignment capabilities, and margin visualization.

**Section sources**
- [OrderDetailModal.tsx](file://src/components/admin/OrderDetailModal.tsx#L20-L228)

### OrderDetailsDialog
The OrderDetailsDialog offers a tabbed interface for viewing comprehensive order information, including details, financial data, and timeline information. This component provides a more detailed view than the basic modal, with organized sections that help administrators quickly access relevant information.

**Section sources**
- [OrderDetailsDialog.tsx](file://src/components/admin/OrderDetailsDialog.tsx#L27-L290)

### CreateSupplierOrderDialog
The CreateSupplierOrderDialog enables administrators to create new supplier orders with associated production stages. This form-based dialog includes fields for order details, pricing, and a dynamic interface for adding multiple production stages with target dates.

**Section sources**
- [CreateSupplierOrderDialog.tsx](file://src/components/admin/CreateSupplierOrderDialog.tsx#L12-L203)

### PerformanceReviewDialog
The PerformanceReviewDialog facilitates the submission of performance reviews for suppliers after order completion. This component includes star rating inputs for quality and communication, date selection for actual delivery, and a notes section for additional feedback.

**Section sources**
- [PerformanceReviewDialog.tsx](file://src/components/admin/PerformanceReviewDialog.tsx#L11-L152)

### SupplierAssignmentDialog
The SupplierAssignmentDialog allows administrators to assign orders to verified suppliers from a searchable list. Suppliers are displayed as selectable cards with performance metrics, MOQ information, and lead times, enabling data-driven assignment decisions.

**Section sources**
- [SupplierAssignmentDialog.tsx](file://src/components/admin/SupplierAssignmentDialog.tsx#L19-L238)

### EmailQuoteModal
The EmailQuoteModal captures user information when requesting a quote to be emailed. This modal includes form validation, pre-filled quote summary information, and optional checkboxes for swatch kits and newsletter subscription, providing a seamless quote delivery experience.

**Section sources**
- [EmailQuoteModal.tsx](file://src/components/quote/EmailQuoteModal.tsx#L11-L260)

### QuoteLoadingStages
The QuoteLoadingStages component displays a visual loading sequence when generating quotes, showing progress through multiple stages with animated indicators and rotating tips. This component enhances user experience during asynchronous operations.

**Section sources**
- [QuoteLoadingStages.tsx](file://src/components/quote/QuoteLoadingStages.tsx#L5-L139)

### OrderDetailDialog
The OrderDetailDialog provides suppliers with a concise view of order details, including product specifications, pricing, target dates, and special instructions. This component includes action buttons for accepting orders or requesting changes, facilitating quick supplier responses.

**Section sources**
- [OrderDetailDialog.tsx](file://src/components/supplier/OrderDetailDialog.tsx#L13-L143)

### SupplierOrderDetailModal
The SupplierOrderDetailModal offers suppliers a detailed interface for reviewing and responding to order assignments. This component includes tabs for accepting, counter-offering, or rejecting orders, with appropriate form fields for each action type.

**Section sources**
- [SupplierOrderDetailModal.tsx](file://src/components/supplier/SupplierOrderDetailModal.tsx#L19-L288)

## Component Architecture
The modal and dialog components in sleekapp-v100 are built on a layered architecture that extends the base shadcn/ui components while maintaining consistency across the application. The architecture follows a clear hierarchy from base components to specialized implementations.

```mermaid
graph TD
BaseComponents[Base UI Components] --> Dialog[Dialog]
BaseComponents --> Sheet[Sheet]
BaseComponents --> Drawer[Drawer]
Dialog --> OrderDetailModal
Dialog --> OrderDetailsDialog
Dialog --> CreateSupplierOrderDialog
Dialog --> PerformanceReviewDialog
Dialog --> SupplierAssignmentDialog
Dialog --> EmailQuoteModal
Dialog --> SupplierOrderDetailModal
Sheet --> OrderDetailDialog
OrderDetailModal --> SupplierAssignmentDialog
OrderDetailsDialog --> SupplierAssignmentDialog
SupplierOrderDetailModal --> CounterOfferForm
SupplierOrderDetailModal --> RejectionForm
style BaseComponents fill:#f9f,stroke:#333
style Dialog fill:#bbf,stroke:#333
style Sheet fill:#bbf,stroke:#333
style Drawer fill:#bbf,stroke:#333
```

**Diagram sources**
- [dialog.tsx](file://src/components/ui/dialog.tsx#L7-L95)
- [sheet.tsx](file://src/components/ui/sheet.tsx#L8-L107)
- [drawer.tsx](file://src/components/ui/drawer.tsx#L6-L87)

## Detailed Component Analysis

### Base Dialog Implementation
The foundation of all modal components is the shadcn/ui Dialog component, which provides the core functionality for modal dialogs including proper focus management, accessibility features, and animation transitions.

```mermaid
classDiagram
class Dialog {
+Root : DialogPrimitive.Root
+Trigger : DialogPrimitive.Trigger
+Portal : DialogPrimitive.Portal
+Overlay : DialogPrimitive.Overlay
+Content : DialogPrimitive.Content
+Header : HTMLDivElement
+Footer : HTMLDivElement
+Title : DialogPrimitive.Title
+Description : DialogPrimitive.Description
}
class DialogContent {
+className : string
+children : ReactNode
+ref : Ref
}
Dialog --> DialogContent : contains
DialogContent --> DialogHeader : contains
DialogContent --> DialogFooter : contains
DialogContent --> DialogTitle : contains
DialogContent --> DialogDescription : contains
```

**Diagram sources**
- [dialog.tsx](file://src/components/ui/dialog.tsx#L7-L95)

### Admin-Focused Components
The administrative components provide comprehensive order management capabilities with specialized functionality for different aspects of order processing and supplier management.

#### OrderDetailModal Analysis
The OrderDetailModal component enables administrators to manage order pricing and supplier assignments. It calculates margins in real-time and provides a seamless interface for updating order details.

```mermaid
flowchart TD
Start([Order Detail Modal Open]) --> DisplayOrderInfo["Display Order Information"]
DisplayOrderInfo --> PricingSection["Pricing Section with Real-time Calculations"]
PricingSection --> MarginCalculation["Calculate Margin & Percentage"]
MarginCalculation --> SupplierAssignment["Supplier Assignment Section"]
SupplierAssignment --> AdminNotes["Admin Notes Input"]
AdminNotes --> SaveChanges["Save Changes Button"]
SaveChanges --> Validation["Validate Inputs"]
Validation --> APIUpdate["Update Order via Supabase API"]
APIUpdate --> SuccessToast["Show Success Toast"]
SuccessToast --> CloseModal["Close Modal"]
APIUpdate --> ErrorHandling["Handle Error"]
ErrorHandling --> ErrorToast["Show Error Toast"]
style Start fill:#f9f,stroke:#333
style SuccessToast fill:#bbf,stroke:#333
style ErrorToast fill:#f96,stroke:#333
```

**Diagram sources**
- [OrderDetailModal.tsx](file://src/components/admin/OrderDetailModal.tsx#L27-L228)

#### SupplierAssignmentDialog Analysis
The SupplierAssignmentDialog provides a searchable interface for selecting suppliers, with performance metrics and lead time information to support data-driven decisions.

```mermaid
sequenceDiagram
participant Admin as "Administrator"
participant Modal as "SupplierAssignmentDialog"
participant API as "Supabase API"
Admin->>Modal : Open dialog
Modal->>API : Fetch verified suppliers
API-->>Modal : Return suppliers sorted by performance
Modal->>Modal : Display supplier cards
Admin->>Modal : Search suppliers
Modal->>Modal : Filter suppliers by search term
Admin->>Modal : Select supplier
Modal->>Modal : Highlight selected supplier
Admin->>Modal : Enter supplier price
Admin->>Modal : Click Assign
Modal->>API : Update order with supplier_id and pricing
API-->>Modal : Success response
Modal->>Admin : Show success toast
Modal->>Modal : Close dialog
```

**Diagram sources**
- [SupplierAssignmentDialog.tsx](file://src/components/admin/SupplierAssignmentDialog.tsx#L26-L238)

### Supplier-Focused Components
The supplier-facing components are designed to facilitate order acceptance, negotiation, and management, with intuitive interfaces that support quick decision-making.

#### SupplierOrderDetailModal Analysis
The SupplierOrderDetailModal provides a tabbed interface for suppliers to respond to order assignments, with dedicated sections for acceptance, counter-offers, and rejections.

```mermaid
flowchart TD
Start([Supplier Order Modal Open]) --> DisplayOrder["Display Order Details"]
DisplayOrder --> CheckStatus["Check acceptance_status"]
CheckStatus --> |Pending| ShowTabs["Show Action Tabs"]
ShowTabs --> AcceptTab["Accept Tab with Confirmation"]
ShowTabs --> CounterTab["Counter Offer Tab"]
ShowTabs --> RejectTab["Reject Tab"]
AcceptTab --> AcceptForm["Acceptance Confirmation"]
AcceptForm --> SubmitAccept["Submit Acceptance"]
SubmitAccept --> APIAccept["Call acceptOrder hook"]
CounterTab --> PriceInput["Counter Price Input"]
CounterTab --> NotesInput["Explanation Notes"]
CounterTab --> SubmitCounter["Submit Counter Offer"]
SubmitCounter --> APICounter["Call submitCounterOffer hook"]
RejectTab --> ReasonInput["Rejection Reason"]
RejectTab --> SubmitReject["Submit Rejection"]
SubmitReject --> APIReject["Call rejectOrder hook"]
APIAccept --> Success["Update UI and Close"]
APICounter --> Success
APIReject --> Success
APIAccept --> Error["Show Error"]
APICounter --> Error
APIReject --> Error
style Start fill:#f9f,stroke:#333
style Success fill:#bbf,stroke:#333
style Error fill:#f96,stroke:#333
```

**Diagram sources**
- [SupplierOrderDetailModal.tsx](file://src/components/supplier/SupplierOrderDetailModal.tsx#L26-L288)

### Quote Management Components
The quote-related components handle the generation, loading, and delivery of quotes, providing a seamless experience from initial request to final delivery.

#### QuoteLoadingStages Analysis
The QuoteLoadingStages component provides visual feedback during the quote generation process, with animated progress indicators and rotating tips to maintain user engagement.

```mermaid
stateDiagram-v2
[*] --> Initial
Initial --> ReadingRequirements : Start loading
ReadingRequirements --> MarketPricing : After 2s
MarketPricing --> BuildingQuote : After 6s
BuildingQuote --> Complete : After 2s
Complete --> [*]
state ReadingRequirements {
[*] --> DisplayMessage : "Reading your requirements..."
DisplayMessage --> RotateTips
RotateTips --> AnalyzeProduct : "Analyzing product specifications"
RotateTips --> UnderstandCustomization : "Understanding customization needs"
RotateTips --> ReviewQuantity : "Reviewing quantity requirements"
}
state MarketPricing {
[*] --> DisplayMessage : "Searching current market pricing..."
DisplayMessage --> RotateTips
RotateTips --> CheckBangladesh : "Checking Bangladesh manufacturer rates..."
RotateTips --> CompareMarket : "Comparing with market averages..."
RotateTips --> AnalyzeCompetitors : "Analyzing competitor pricing..."
RotateTips --> CalculateShipping : "Calculating shipping costs..."
}
state BuildingQuote {
[*] --> DisplayMessage : "Building your custom quote..."
DisplayMessage --> RotateTips
RotateTips --> FinalizePricing : "Finalizing pricing calculations"
RotateTips --> PrepareBreakdown : "Preparing detailed breakdown"
RotateTips --> GenerateTimeline : "Generating timeline estimates"
}
```

**Diagram sources**
- [QuoteLoadingStages.tsx](file://src/components/quote/QuoteLoadingStages.tsx#L5-L139)

## Responsive Design & Accessibility
The modal components in sleekapp-v100 are designed with responsive behavior and accessibility as core principles, ensuring a consistent experience across devices and compliance with WCAG standards.

### Responsive Behavior
All modal components adapt their layout and behavior based on screen size, utilizing the useIsMobile hook to adjust their presentation for optimal user experience.

```mermaid
flowchart TD
Start([Component Render]) --> CheckDevice["Check device type"]
CheckDevice --> |Mobile| ApplyMobileStyles["Apply mobile-specific styles"]
CheckDevice --> |Desktop| ApplyDesktopStyles["Apply desktop-specific styles"]
ApplyMobileStyles --> SheetOrDrawer["Use Sheet or Drawer component"]
ApplyMobileStyles --> FullScreen["Full width and height"]
ApplyMobileStyles --> SimplifiedLayout["Simplified layout with vertical flow"]
ApplyDesktopStyles --> DialogComponent["Use Dialog component"]
ApplyDesktopStyles --> MaxWidth["Constrained width (max-w-lg, max-w-3xl, etc.)"]
ApplyDesktopStyles --> Scrollable["Scrollable content with max-h-[90vh]"]
style Start fill:#f9f,stroke:#333
style SheetOrDrawer fill:#bbf,stroke:#333
style DialogComponent fill:#bbf,stroke:#333
```

**Diagram sources**
- [use-mobile.tsx](file://src/hooks/use-mobile.tsx#L5-L32)
- [sheet.tsx](file://src/components/ui/sheet.tsx#L8-L107)
- [drawer.tsx](file://src/components/ui/drawer.tsx#L6-L87)

### Accessibility Features
The modal components implement comprehensive accessibility features to ensure compliance with WCAG standards and provide an inclusive user experience.

```mermaid
flowchart TD
AccessibilityFeatures[Accessibility Features] --> KeyboardNavigation["Keyboard Navigation"]
AccessibilityFeatures --> FocusManagement["Focus Management"]
AccessibilityFeatures --> ARIAAttributes["ARIA Attributes"]
AccessibilityFeatures --> ScreenReaderSupport["Screen Reader Support"]
AccessibilityFeatures --> ColorContrast["Color Contrast"]
KeyboardNavigation --> TabOrder["Logical tab order"]
KeyboardNavigation --> EscapeClose["Escape key closes modal"]
KeyboardNavigation --> EnterSubmit["Enter key submits forms"]
FocusManagement --> InitialFocus["Focus on first interactive element"]
FocusManagement --> TrapFocus["Trap focus within modal"]
FocusManagement --> ReturnFocus["Return focus to trigger"]
ARIAAttributes --> RoleDialog["role='dialog'"]
ARIAAttributes --> AriaLabelledby["aria-labelledby"]
ARIAAttributes --> AriaDescribedby["aria-describedby"]
ARIAAttributes --> AriaModal["aria-modal='true'"]
ScreenReaderSupport --> SROnly["sr-only class for hidden text"]
ScreenReaderSupport --> DescriptiveText["Clear, descriptive text"]
ColorContrast --> WCAGCompliance["WCAG AA/AAA compliance"]
ColorContrast --> TextBackground["Sufficient text/background contrast"]
```

**Diagram sources**
- [dialog.tsx](file://src/components/ui/dialog.tsx#L15-L51)
- [sheet.tsx](file://src/components/ui/sheet.tsx#L16-L28)
- [drawer.tsx](file://src/components/ui/drawer.tsx#L17-L22)

## Styling & Theming
The modal components leverage Tailwind CSS and design tokens for consistent styling and theming across the application, allowing for easy customization and brand alignment.

### Style Customization Options
The components provide various customization options through Tailwind CSS classes and component props, enabling developers to adapt the appearance to specific needs.

```mermaid
classDiagram
class StylingOptions {
+maxWidth : string (max-w-lg, max-w-3xl, max-w-4xl)
+maxHeight : string (max-h-[90vh])
+overflow : string (overflow-y-auto)
+borderRadius : string (rounded-lg, sm : rounded-lg)
+shadow : string (shadow-lg)
+background : string (bg-background)
+animation : string (data-[state=open] : animate-in)
+responsive : boolean (sm : max-w-lg)
}
class ThemeSupport {
+designTokens : object
+cssVariables : object
+darkMode : boolean
+highContrast : boolean
}
StylingOptions --> ThemeSupport : extends
```

**Diagram sources**
- [dialog.tsx](file://src/components/ui/dialog.tsx#L30-L43)
- [sheet.tsx](file://src/components/ui/sheet.tsx#L31-L47)
- [lib/designTokens.ts](file://src/lib/designTokens.ts)

## Performance Considerations
The modal components are optimized for performance, with considerations for rendering efficiency, data loading, and user experience during asynchronous operations.

### Modal Rendering Optimization
The components implement several performance optimizations to ensure smooth rendering and interaction.

```mermaid
flowchart TD
PerformanceOptimizations[Performance Optimizations] --> LazyRendering["Lazy Rendering"]
PerformanceOptimizations --> EfficientRe renders["Efficient Re-renders"]
PerformanceOptimizations --> Memoization["Memoization"]
PerformanceOptimizations --> CodeSplitting["Code Splitting"]
LazyRendering --> ConditionalRender["Conditional rendering based on 'open' prop"]
LazyRendering --> PortalOptimization["Use of Portals for efficient DOM manipulation"]
EfficientRe renders --> StateMinimization["Minimize state updates"]
EfficientRe renders --> EventHandlers["Optimize event handlers with useCallback"]
Memoization --> ReactMemo["Use React.memo for pure components"]
Memoization --> useMemo["Use useMemo for expensive calculations"]
CodeSplitting --> DynamicImport["Dynamic import for heavy components"]
CodeSplitting --> BundleOptimization["Tree shaking and bundle optimization"]
```

**Diagram sources**
- [dialog.tsx](file://src/components/ui/dialog.tsx#L30-L51)
- [OrderDetailModal.tsx](file://src/components/admin/OrderDetailModal.tsx#L27-L228)
- [SupplierOrderDetailModal.tsx](file://src/components/supplier/SupplierOrderDetailModal.tsx#L26-L288)

### Data Loading Strategies
The components implement efficient data loading strategies to minimize latency and provide feedback during asynchronous operations.

```mermaid
sequenceDiagram
participant User as "User"
participant Component as "Modal Component"
participant API as "Supabase API"
User->>Component : Open modal
Component->>Component : Show loading state
Component->>API : Fetch data (if needed)
API-->>Component : Return data
Component->>Component : Process data
Component->>Component : Update state
Component->>User : Display modal content
User->>Component : Interact with modal
Component->>API : Submit changes (if applicable)
API-->>Component : Return response
Component->>User : Show success/error feedback
Component->>Component : Close modal (if successful)
```

**Diagram sources**
- [SupplierAssignmentDialog.tsx](file://src/components/admin/SupplierAssignmentDialog.tsx#L40-L67)
- [OrderDetailsDialog.tsx](file://src/components/admin/OrderDetailsDialog.tsx#L37-L38)
- [EmailQuoteModal.tsx](file://src/components/quote/EmailQuoteModal.tsx#L32-L96)

## Usage Examples

### Integration with Base Components
The modal components are built by extending the base shadcn/ui components, demonstrating how to create specialized interfaces while maintaining consistency.

```mermaid
flowchart TD
BaseComponent[Base Dialog Component] --> Customization["Apply Customizations"]
Customization --> Size["Adjust size with className"]
Customization --> Content["Customize content structure"]
Customization --> Behavior["Enhance behavior with additional logic"]
Customization --> Styling["Apply application-specific styling"]
Size --> MaxWidth["max-w-3xl, max-w-4xl"]
Size --> MaxHeight["max-h-[90vh]"]
Size --> Overflow["overflow-y-auto"]
Content --> Tabs["Add Tabs for organization"]
Content --> Forms["Integrate forms for data entry"]
Content --> Cards["Use Cards for information grouping"]
Behavior --> DataFetching["Add data fetching logic"]
Behavior --> StateManagement["Implement local state"]
Behavior --> APIIntegration["Connect to Supabase API"]
Styling --> Tailwind["Use Tailwind utility classes"]
Styling --> DesignTokens["Apply design tokens"]
Styling --> Responsive["Ensure responsive behavior"]
```

**Diagram sources**
- [dialog.tsx](file://src/components/ui/dialog.tsx#L30-L43)
- [OrderDetailsDialog.tsx](file://src/components/admin/OrderDetailsDialog.tsx#L48-L267)
- [CreateSupplierOrderDialog.tsx](file://src/components/admin/CreateSupplierOrderDialog.tsx#L105-L201)

### Responsive Implementation
The components adapt their presentation based on device type, using different base components for mobile and desktop experiences.

```mermaid
flowchart TD
DeviceCheck[Check Device Type] --> |Mobile| UseSheetOrDrawer["Use Sheet or Drawer"]
DeviceCheck --> |Desktop| UseDialog["Use Dialog"]
UseSheetOrDrawer --> SheetProps["Sheet: side='bottom', full width"]
UseSheetOrDrawer --> DrawerProps["Drawer: bottom-aligned, handle indicator"]
UseDialog --> DialogProps["Dialog: centered, constrained width"]
UseDialog --> ResponsiveProps["Responsive props: sm:max-w-lg"]
style DeviceCheck fill:#f9f,stroke:#333
style UseSheetOrDrawer fill:#bbf,stroke:#333
style UseDialog fill:#bbf,stroke:#333
```

**Diagram sources**
- [use-mobile.tsx](file://src/hooks/use-mobile.tsx#L5-L32)
- [sheet.tsx](file://src/components/ui/sheet.tsx#L31-L47)
- [drawer.tsx](file://src/components/ui/drawer.tsx#L31-L38)

## Conclusion
The modal and dialog components in sleekapp-v100 provide a comprehensive system for user interactions across different roles and workflows. Built on the solid foundation of shadcn/ui components, these modals extend the base functionality with specialized features for order management, supplier assignment, quote handling, and performance reviews. The components follow consistent design patterns while adapting to specific use cases, with careful attention to responsive behavior, accessibility, and performance. By leveraging Tailwind CSS and design tokens, the components maintain visual consistency while allowing for customization. The architecture supports efficient data loading and provides clear feedback during asynchronous operations, creating a seamless user experience across the application.