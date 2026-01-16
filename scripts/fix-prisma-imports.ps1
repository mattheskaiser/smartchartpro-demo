# Fix all PrismaClient imports to use the singleton

$files = @(
    "src/app/api/shifts/route.ts",
    "src/app/api/shifts/[id]/route.ts",
    "src/app/api/shift-templates/route.ts",
    "src/app/api/shift-templates/[id]/route.ts",
    "src/app/api/residents/route.ts",
    "src/app/api/residents/[id]/route.ts",
    "src/app/api/residents/[id]/specialists/route.ts",
    "src/app/api/residents/[id]/specialists/[specialistId]/route.ts",
    "src/app/api/residents/[id]/dnr-status/route.ts",
    "src/app/api/residents/[id]/conditions/route.ts",
    "src/app/api/residents/[id]/conditions/[conditionId]/route.ts",
    "src/app/api/residents/[id]/medications/route.ts",
    "src/app/api/residents/[id]/medications/[medicationId]/route.ts",
    "src/app/api/residents/[id]/allergies/route.ts",
    "src/app/api/residents/[id]/allergies/[allergyId]/route.ts",
    "src/app/api/cnas/[id]/route.ts",
    "src/app/api/cnas/[id]/availability/route.ts",
    "src/app/api/sessions/[id]/route.ts",
    "src/app/api/auth/change-password/route.ts",
    "src/app/api/admin/cna-accounts/[id]/route.ts",
    "src/lib/session-service.ts",
    "src/lib/initializeDefaults.ts"
)

foreach ($file in $files) {
    if (Test-Path $file) {
        Write-Host "Fixing $file..."
        $content = Get-Content $file -Raw
        
        # Replace the import
        $content = $content -replace "import \{ PrismaClient \} from '@prisma/client';", "import { prisma } from '@/lib/db';"
        
        # Remove the const prisma line
        $content = $content -replace "const prisma = new PrismaClient\(\);[\r\n]*", ""
        
        Set-Content $file -Value $content -NoNewline
        Write-Host "  Done"
    } else {
        Write-Host "  File not found: $file"
    }
}

Write-Host ""
Write-Host "All files updated!"
