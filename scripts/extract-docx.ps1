$ErrorActionPreference = 'Stop'

$outputDir = Join-Path -Path (Get-Location) -ChildPath 'extracted'
if (-not (Test-Path $outputDir)) { New-Item -ItemType Directory -Path $outputDir | Out-Null }

Get-ChildItem -Path . -File -Filter '*.docx' | ForEach-Object {
	$docx = $_.FullName
	$name = $_.BaseName
	$tmp  = Join-Path -Path $env:TEMP -ChildPath ([System.IO.Path]::GetRandomFileName())
	New-Item -ItemType Directory -Path $tmp | Out-Null
	$zip  = Join-Path -Path $tmp -ChildPath ("$name.zip")
	Copy-Item -Path $docx -Destination $zip
	Expand-Archive -Path $zip -DestinationPath $tmp -Force
	$docXml = Join-Path -Path $tmp -ChildPath 'word/document.xml'
	if (Test-Path $docXml) {
		$xml  = [System.IO.File]::ReadAllText($docXml)
		$text = [System.Text.RegularExpressions.Regex]::Replace($xml, '<[^>]+>', ' ')
		$text = [System.Text.RegularExpressions.Regex]::Replace($text, '\s+', ' ').Trim()
		[System.IO.File]::WriteAllText((Join-Path $outputDir ("$name.txt")), $text, [System.Text.UTF8Encoding]::new($false))
	}
	Remove-Item -Path $tmp -Recurse -Force
}

Write-Output "Extracted DOCX -> $outputDir"


