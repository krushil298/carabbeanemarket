param(
  [string]$ProjectRef = "",
  [string]$SupabaseUrl = "",
  [string]$ServiceRoleKey = "",
  [string]$AnonKey = "",
  [string]$TestEmail = "",
  [string]$ResendApiKey = "",
  [string]$ResendFrom = ""
)

function Ensure-Scoop {
  if (-not (Get-Command scoop -ErrorAction SilentlyContinue)) {
    Write-Host "Installing Scoop..." -ForegroundColor Cyan
    Set-ExecutionPolicy -Scope CurrentUser RemoteSigned -Force
    iwr -useb get.scoop.sh | iex
  }
}

function Ensure-SupabaseCLI {
  if (-not (Get-Command supabase -ErrorAction SilentlyContinue)) {
    Write-Host "Installing Supabase CLI..." -ForegroundColor Cyan
    scoop install supabase
  }
}

function Ask([string]$v,[string]$p){ if([string]::IsNullOrWhiteSpace($v)){ Read-Host $p } else { $v } }

# Ensure tools
Ensure-Scoop; Ensure-SupabaseCLI

# Login + link
Write-Host "`n== Supabase login ==" -ForegroundColor Cyan
supabase login
$ProjectRef = Ask $ProjectRef "Project Ref (e.g. abcdefghijklmno)"
if ([string]::IsNullOrWhiteSpace($ProjectRef)) { throw "Project ref required" }
Write-Host "Linking project..." -ForegroundColor Cyan
supabase link --project-ref $ProjectRef

# Secrets
$SupabaseUrl    = Ask $SupabaseUrl    "SUPABASE_URL (https://$ProjectRef.supabase.co)"
$ServiceRoleKey = Ask $ServiceRoleKey "Service Role key (starts with eyJ...)"
Invoke-Expression "supabase functions secrets set SUPABASE_URL='$SupabaseUrl'"
Invoke-Expression "supabase functions secrets set SUPABASE_SERVICE_ROLE_KEY='$ServiceRoleKey'"

if (-not [string]::IsNullOrWhiteSpace($ResendApiKey)) {
  Invoke-Expression "supabase functions secrets set RESEND_API_KEY='$ResendApiKey'"
  if (-not [string]::IsNullOrWhiteSpace($ResendFrom)) {
    Invoke-Expression "supabase functions secrets set RESEND_FROM='$ResendFrom'"
  }
}

# Deploy both functions
Write-Host "`n== Deploying Edge Functions ==" -ForegroundColor Cyan
supabase functions deploy send-verification-email
if ($LASTEXITCODE -ne 0) { throw "Deploy failed: send-verification-email" }
supabase functions deploy verify-email-code
if ($LASTEXITCODE -ne 0) { throw "Deploy failed: verify-email-code" }

# DB table (manual, 1 paste)
$createSql = @"
create table if not exists public.verification_codes (
  id bigserial primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  code text not null,
  type text not null check (type in ('email')),
  expires_at timestamptz not null,
  is_used boolean not null default false,
  created_at timestamptz not null default now()
);
"@
Write-Host "`nOpen Supabase → SQL Editor, paste this and click Run:" -ForegroundColor Yellow
Write-Host $createSql -ForegroundColor DarkYellow
Read-Host "Press ENTER after you run the SQL"

# Test user (create or look up)
$TestEmail = Ask $TestEmail "A test email (e.g. you@example.com)"
$hdrs = @{ Authorization="Bearer $ServiceRoleKey"; apikey=$ServiceRoleKey; "Content-Type"="application/json" }

try {
  $q  = [uri]::EscapeDataString($TestEmail)
  $u  = Invoke-RestMethod -Uri "$SupabaseUrl/auth/v1/admin/users?email=$q" -Method Get -Headers $hdrs
  $UserId = $u.users[0].id
} catch { $UserId = $null }

if (-not $UserId) {
  $pwd = "TempPass12!@"
  $body = @{ email=$TestEmail; password=$pwd; email_confirm=$false } | ConvertTo-Json
  $resp = Invoke-RestMethod -Uri "$SupabaseUrl/auth/v1/admin/users" -Method Post -Headers $hdrs -Body $body
  $UserId = $resp.id
}
if (-not $UserId) { throw "Could not obtain a user id" }
Write-Host "User ID: $UserId" -ForegroundColor DarkGray

# Call functions
$AnonKey = Ask $AnonKey "Anon key (Settings → API → anon key)"
$funcHdrs = @{ Authorization="Bearer $AnonKey"; "Content-Type"="application/json" }

Write-Host "`nRequesting a code..." -ForegroundColor Cyan
$sendBody = @{ email=$TestEmail; userId=$UserId } | ConvertTo-Json
$sendResp = Invoke-RestMethod -Uri "$SupabaseUrl/functions/v1/send-verification-email" -Method Post -Headers $funcHdrs -Body $sendBody
$sendResp | ConvertTo-Json -Depth 5 | Write-Host

$code = $sendResp.devCode
if (-not $code) { $code = Read-Host "Enter the code you received by email" } else { Write-Host "Dev code: $code" -ForegroundColor Yellow }

Write-Host "Verifying code..." -ForegroundColor Cyan
$verifyBody = @{ userId=$UserId; code=$code } | ConvertTo-Json
$verifyResp = Invoke-RestMethod -Uri "$SupabaseUrl/functions/v1/verify-email-code" -Method Post -Headers $funcHdrs -Body $verifyBody
$verifyResp | ConvertTo-Json -Depth 5 | Write-Host

# Confirm user metadata
$u2 = Invoke-RestMethod -Uri "$SupabaseUrl/auth/v1/admin/users/$UserId" -Method Get -Headers $hdrs
if ($u2.user_metadata.email_verified -eq $true) {
  Write-Host "`nALL SET: Email verified ✅" -ForegroundColor Green
} else {
  Write-Host "`nVerification metadata not set. Check Function logs in Supabase." -ForegroundColor Yellow
}