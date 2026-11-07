# ch00_coordinates_routes (#5f) remake 2026-11-07: start checks/r7_queue.sh detached (survives the session), output to
# G:/.../scratch/movies/ch00_coordinates_routes/r7_queue.log. usage: powershell -NoProfile -File movies/src/ch00_coordinates_routes/checks/r7_queue_start.ps1
$repo = "C:\Users\sislam27\Work\Climate Dynamics PHD\AOFD Vallis"
$log = "G:\Geophysical Fluid Dynamics\aofd-data\scratch\movies\ch00_coordinates_routes\r7_queue.log"
$cmd = "cd '/c/Users/sislam27/Work/Climate Dynamics PHD/AOFD Vallis' && bash movies/src/ch00_coordinates_routes/checks/r7_queue.sh VH >> '$($log -replace '\\','/')' 2>&1"
$p = Start-Process -FilePath "C:\Program Files\Git\bin\bash.exe" -ArgumentList @("-lc", "`"$cmd`"") -WindowStyle Hidden -PassThru
"started r7_queue.sh pid $($p.Id) at $(Get-Date -Format s); log $log"
