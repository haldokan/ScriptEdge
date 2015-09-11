<%
dim travelMthd,travelDest
travelMthd=Request.Form("travelMthd")
travelDest=Request.Form("travelDest")
Response.Write("You will be travelling by " & travelMthd & " to " & travelDest & ".")
%>