﻿$ProgressPreference = "SilentlyContinue"

function BiliDown {
    param (
        [parameter(position = 1)]$BID,
        [parameter(position = 2)]$Part = ""
    )
    $Headers = @{}
    $Headers.Add("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:65.0) Gecko/20100101 Firefox/65.0")
    $Headers.Add("Referer", "https://www.bilibili.com")

    if ($BID.StartsWith("a") -or $BID.StartsWith("A")) {
        $VID = $BID.Substring(2)
        $PageList = "https://api.bilibili.com/x/player/pagelist?aid=$($VID)&jsonp=jsonp"
        $SourcePrefix = "https://api.bilibili.com/x/player/playurl?avid"
    }
    elseif ($BID.StartsWith("b") -or $BID.StartsWith("B")) {
        $VID = $BID
        $PageList = "https://api.bilibili.com/x/player/pagelist?bvid=$($VID)&jsonp=jsonp"
        $SourcePrefix = "https://api.bilibili.com/x/player/playurl?bvid"
    }
    else {
        exit
    }
    $Pages = (Invoke-WebRequest -Uri $PageList -Headers $Headers -UseBasicParsing).Content | ConvertFrom-Json
    $CIDs = @()
    if ($Part -EQ "") {
        $CIDs += $Pages.data | Where-Object page -EQ 1 | Select-Object cid
    }
    elseif ($Part -EQ "0") {
        $CIDs += $Pages.data | Select-Object cid
    }
    else {
        $CIDs += $Pages.data | Where-Object page -EQ $Part | Select-Object cid
    }
    Write-Host "$($BID) Video Downloading......"
    $CIDs | ForEach-Object {
        function DownWithFFMPEG {
            param (
                [parameter(position = 1)]$CID,
                [parameter(position = 2)]$CIDIndex
            )
            $NormalUrl = "https://www.bilibili.com/video/$($BID)"
            $ReDirectTest = Invoke-WebRequest -Method Head -Uri $NormalUrl -Headers $Headers -UseBasicParsing
            if ($null -ne $ReDirectTest.RequestMessage.RequestUri -and $ReDirectTest.RequestMessage.RequestUri.ToString() -Match "bangumi" ) {
                # Write-Host $ReDirectTest.BaseResponse.RequestMessage.RequestUri
                $EPId = $ReDirectTest.BaseResponse.RequestMessage.RequestUri.ToString().Split("/")[-1].Substring(2)
                $PGCSourceUrl = "https://api.bilibili.com/pgc/player/web/playurl?cid=$($CID)&qn=120&type=&otype=json&fourk=1&ep_id=$($EPId)&fnver=0&fnval=80"
                $VideoData = (Invoke-WebRequest -Uri $PGCSourceUrl -Headers $Headers -UseBasicParsing).Content | ConvertFrom-Json
                $SourceFiles = $VideoData.result.dash
            }
            else {
                $VideoData = (Invoke-WebRequest -Uri $SourceUrl -Headers $Headers -UseBasicParsing).Content | ConvertFrom-Json
                $SourceFiles = $VideoData.data.dash
            }
            try {
                $aria2cArgs = "-x16 -s12 -j20 -k1M --continue --check-certificate=false --file-allocation=none --summary-interval=0 --download-result=hide --disable-ipv6 ""$($SourceFiles.audio[0].baseUrl)"" --header=""User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:78.0) Gecko/20100101 Firefox/78.0"" --header=""Referer: https://www.bilibili.com"" --out ../主榜视频/$($CID)_a.m4s"
                Start-Process -NoNewWindow -Wait -FilePath "aria2c.exe" -RedirectStandardError "../主榜视频/$($CID)_.log" -ArgumentList $aria2cArgs
                
                $aria2cArgs = "-x16 -s12 -j20 -k1M --continue --check-certificate=false --file-allocation=none --summary-interval=0 --download-result=hide --disable-ipv6 ""$($SourceFiles.video[0].baseUrl)"" --header=""User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:78.0) Gecko/20100101 Firefox/78.0"" --header=""Referer: https://www.bilibili.com"" --out ../主榜视频/$($CID)_v.m4s"
                Start-Process -NoNewWindow -Wait -FilePath "aria2c.exe" -RedirectStandardError "../主榜视频/$($CID)_.log" -ArgumentList $aria2cArgs
                if ($CIDIndex -EQ "0") {
                    $Filename = $BID
                }
                else {
                    $Filename = "$($BID)_$($CIDIndex)"
                }
                $ffmpegArgs = "-y -hide_banner -i ../主榜视频/$($CID)_a.m4s -i ../主榜视频/$($CID)_v.m4s -c copy ../主榜视频/$($Filename).mp4"
                Start-Process -NoNewWindow -Wait -FilePath "ffmpeg.exe" -RedirectStandardError "../主榜视频/$($CID)_.log" -ArgumentList $ffmpegArgs
                Remove-Item "../主榜视频/$($CID)_*.*"
            }
            catch {
                New-Item -Path "../主榜视频/" -Name "$($BID).txt" -ItemType "file" -Value "" -Force
            }
        }
        $OID = $_
        $SourceUrl = "$($SourcePrefix)=$($VID)&cid=$($OID.cid)&qn=120&fnver=0&fourk=1&fnval=80&otype=json&type="
        DownWithFFMPEG $OID.cid $CIDs.IndexOf($OID)
    }
}

function Main {
    $RankVideos = @()

    Get-Content "./download.txt" | ForEach-Object {
        $RankVideos += "$($_)"
    }

    $ExistVideos = @()
    Get-Item "../主榜视频/*.mp4" | ForEach-Object { $ExistVideos += $_.BaseName }
    $NeedVideos = $RankVideos | Where-Object { $ExistVideos -notcontains $_ }

    $NeedVideos | ForEach-Object {
        BiliDown $_
    }
}
Main