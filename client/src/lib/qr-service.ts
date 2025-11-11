import QRCodeStyling from 'qr-code-styling';

export type DotType = 'rounded' | 'dots' | 'classy' | 'classy-rounded' | 'square' | 'extra-rounded';
export type CornerSquareType = 'dot' | 'square' | 'extra-rounded';
export type CornerDotType = 'dot' | 'square';

const brandIconMap: Record<string, string> = {
  'facebook': 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHJ4PSI0IiByeT0iNCIgZmlsbD0iIzE4NzdGMiIvPgogIDxwYXRoIGQ9Ik0xNi41IDdIMTRjLS44OSAwLTEgLjM2LTEgMS4xVjEwaDNsLS41IDNIMTN2NmgtM3YtNkg4VjEwaDJWOGMwLTIuNDg1IDEuMjktNCA0LTRoMi41djN6IiBmaWxsPSJ3aGl0ZSIvPgo8L3N2Zz4K',
  'instagram': 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8ZGVmcz4KICAgIDxsaW5lYXJHcmFkaWVudCBpZD0iaWciIHgxPSIwJSIgeTE9IjEwMCUiIHgyPSIxMDAlIiB5Mj0iMCUiPgogICAgICA8c3RvcCBvZmZzZXQ9IjAlIiBzdG9wLWNvbG9yPSIjZmRkNzM1Ii8+CiAgICAgIDxzdG9wIG9mZnNldD0iMjUlIiBzdG9wLWNvbG9yPSIjZmM0YTFhIi8+CiAgICAgIDxzdG9wIG9mZnNldD0iNTAlIiBzdG9wLWNvbG9yPSIjZTE0ZGRlIi8+CiAgICAgIDxzdG9wIG9mZnNldD0iNzUlIiBzdG9wLWNvbG9yPSIjYzEzNTg0Ii8+CiAgICAgIDxzdG9wIG9mZnNldD0iMTAwJSIgc3RvcC1jb2xvcj0iIzgxMzQ5NCIvPgogICAgPC9saW5lYXJHcmFkaWVudD4KICA8L2RlZnM+CiAgPHJlY3Qgd2lkdGg9IjI0IiBoZWlnaHQ9IjI0IiByeD0iNCIgcnk9IjQiIGZpbGw9InVybCgjaWcpIi8+CiAgPHJlY3QgeD0iNSIgeT0iNSIgd2lkdGg9IjE0IiBoZWlnaHQ9IjE0IiByeD0iNCIgcnk9IjQiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMiIvPgogIDxjaXJjbGUgY3g9IjEyIiBjeT0iMTIiIHI9IjMiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMiIvPgogIDxjaXJjbGUgY3g9IjE2LjUiIGN5PSI3LjUiIHI9IjEiIGZpbGw9IndoaXRlIi8+Cjwvc3ZnPgo=',
  'twitter-bird': 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHJ4PSI0IiByeT0iNCIgZmlsbD0iIzFkOWJmMCIvPgogIDxwYXRoIGQ9Ik0xOCA2LjVjLS42Mi4yNy0xLjI4LjQ1LTEuOTguNTMuNzEtLjQzIDEuMjYtMS4xIDEuNTEtMS45MS0uNjcuNC0xLjQuNjktMi4xOC44NC0uNjMtLjY3LTEuNTItMS4wOC0yLjUxLTEuMDgtMS45IDAtMy40NCAxLjU0LTMuNDQgMy40NCAwIC4yNy4wMy41My4wOC43OEM3LjY5IDguMiA1LjY3IDcuMSA0LjMzIDUuMzNjLS4zLjUxLS40NyAxLjEtLjQ3IDEuNzQgMCAxLjE5LjYxIDIuMjUgMS41MyAyLjg2LS41Ni0uMDItMS4wOS0uMTctMS41NC0uNDN2LjA0YzAgMS42NyAxLjE4IDMuMDYgMi43NSAzLjM4LS4yOS4wOC0uNTkuMTItLjkuMTItLjIyIDAtLjQzLS4wMi0uNjQtLjA2LjQzIDEuMzUgMS42OSAyLjMzIDMuMTggMi4zNi0xLjE3LjkxLTIuNjUgMS40Ni00LjI1IDEuNDYtLjI4IDAtLjU1LS4wMi0uODItLjA1IDEuNTIuOTcgMy4zMyAxLjU0IDUuMjcgMS41NCA2LjMzIDAgOS44LTUuMjQgOS44LTkuNzggMC0uMTUgMC0uMy0uMDEtLjQ0LjY3LS40OSAxLjI1LTEuMDkgMS43MS0xLjc4eiIgZmlsbD0id2hpdGUiLz4KPC9zdmc+Cg==',
  'twitter-x': 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHJ4PSI0IiByeT0iNCIgZmlsbD0iIzAwMDAwMCIvPgogIDxwYXRoIGQ9Ik0xOC45MDEgMS4xNTNoMy42OGwtOC4wNCA5LjE5TDI0IDIyLjg0NmgtNy40MDZsLTUuOC03LjU4NC02LjYzOCA3LjU4NEguNDc0bDguNi05LjgzTDAgMS4xNTRoNy41OTRsNS4yNDMgNi45MzJaTTE3LjYxIDIwLjY0NGgyLjAzOUw2LjQ4NiAzLjI0SDQuMjk4WiIgZmlsbD0id2hpdGUiLz4KPC9zdmc+Cg==',
  'twitter': 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHJ4PSI0IiByeT0iNCIgZmlsbD0iIzFkOWJmMCIvPgogIDxwYXRoIGQ9Ik0xOCA2LjVjLS42Mi4yNy0xLjI4LjQ1LTEuOTguNTMuNzEtLjQzIDEuMjYtMS4xIDEuNTEtMS45MS0uNjcuNC0xLjQuNjktMi4xOC44NC0uNjMtLjY3LTEuNTItMS4wOC0yLjUxLTEuMDgtMS45IDAtMy40NCAxLjU0LTMuNDQgMy40NCAwIC4yNy4wMy41My4wOC43OEM3LjY5IDguMiA1LjY3IDcuMSA0LjMzIDUuMzNjLS4zLjUxLS40NyAxLjEtLjQ3IDEuNzQgMCAxLjE5LjYxIDIuMjUgMS41MyAyLjg2LS41Ni0uMDItMS4wOS0uMTctMS41NC0uNDN2LjA0YzAgMS42NyAxLjE4IDMuMDYgMi43NSAzLjM4LS4yOS4wOC0uNTkuMTItLjkuMTItLjIyIDAtLjQzLS4wMi0uNjQtLjA2LjQzIDEuMzUgMS42OSAyLjMzIDMuMTggMi4zNi0xLjE3LjkxLTIuNjUgMS40Ni00LjI1IDEuNDYtLjI4IDAtLjU1LS4wMi0uODItLjA1IDEuNTIuOTcgMy4zMyAxLjU0IDUuMjcgMS41NCA2LjMzIDAgOS44LTUuMjQgOS44LTkuNzggMC0uMTUgMC0uMy0uMDEtLjQ0LjY3LS40OSAxLjI1LTEuMDkgMS43MS0xLjc4eiIgZmlsbD0id2hpdGUiLz4KPC9zdmc+Cg==',
  'linkedin': 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHJ4PSI0IiByeT0iNCIgZmlsbD0iIzAwN2NiNyIvPgogIDx0ZXh0IHg9IjEyIiB5PSIxNiIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjEwIiBmb250LXdlaWdodD0iYm9sZCIgZmlsbD0id2hpdGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiPmluPC90ZXh0Pgo8L3N2Zz4K',
  'youtube': 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHJ4PSI0IiByeT0iNCIgZmlsbD0iI2ZmMDAwMCIvPgogIDxyZWN0IHg9IjQiIHk9IjciIHdpZHRoPSIxNiIgaGVpZ2h0PSIxMCIgcng9IjIiIHJ5PSIyIiBmaWxsPSJ3aGl0ZSIvPgogIDxwb2x5Z29uIHBvaW50cz0iMTAsMTAgMTUsMTIuNSAxMCwxNSIgZmlsbD0iI2ZmMDAwMCIvPgo8L3N2Zz4K',
  'paypal': 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHJ4PSI1IiBmaWxsPSIjMDAzMDg3Ii8+PHBhdGggZD0iTTkgNmg0YzIuMiAwIDMuOCAxLjMgMy44IDMuNCAwIDIuNC0xLjYgNC0zLjggNGgtMi4zbC0uNyA1LjZINy41bDEuOS0xM0g5em0xLjMgMi41bC0uNyA0aDJjMS4xIDAgMS45LS43IDEuOS0yIDAtMS0uNy0yLTEuOS0yaC0xLjN6IiBmaWxsPSJ3aGl0ZSIvPjwvc3ZnPg==',
  'zoom': 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHJ4PSI0IiByeT0iNCIgZmlsbD0iIzI5ODJmZiIvPgogIDxyZWN0IHg9IjUiIHk9IjgiIHdpZHRoPSIxMCIgaGVpZ2h0PSI3IiByeD0iMiIgcnk9IjIiIGZpbGw9IndoaXRlIi8+CiAgPHBvbHlnb24gcG9pbnRzPSIxNSwxMCAyMCw3IDIwLDE3IDE1LDE0IiBmaWxsPSJ3aGl0ZSIvPgo8L3N2Zz4K',
  'wifi': 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8IS0tIE91dGVybW9zdCBXaUZpIHNpZ25hbCBhcmMgLS0+CiAgPHBhdGggZD0iTTIgOC41YzUuNS01LjUgMTQuNS01LjUgMjAgMCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjNjBBNUZBIiBzdHJva2Utd2lkdGg9IjMiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIvPgogIDwhLS0gTWlkZGxlIFdpRmkgc2lnbmFsIGFyYyAtLT4KICA8cGF0aCBkPSJNNSAxMS41YzQtNCAxMC00IDE0IDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzYwQTVGQSIgc3Ryb2tlLXdpZHRoPSIzIiBzdHJva2UtbGluZWNhcD0icm91bmQiLz4KICA8IS0tIElubmVyIFdpRmkgc2lnbmFsIGFyYyAtLT4KICA8cGF0aCBkPSJNOC41IDE1YzIuNS0yLjUgNC41LTIuNSA3IDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzYwQTVGQSIgc3Ryb2tlLXdpZHRoPSIzIiBzdHJva2UtbGluZWNhcD0icm91bmQiLz4KICA8IS0tIFdpRmkgc2lnbmFsIGRvdCAtLT4KICA8Y2lyY2xlIGN4PSIxMiIgY3k9IjE5IiByPSIyIiBmaWxsPSIjNjBBNUZBIi8+Cjwvc3ZnPgo=',
  'whatsapp': 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHJ4PSI1IiByeT0iNSIgZmlsbD0iIzI1RDM2NiIvPjxwYXRoIGZpbGw9IiNGRkZGRkYiIGQ9Ik0xMiAzLjVjLTQuNjkgMC04LjUgMy44MS04LjUgOC41IDAgMS40OC4zOCAyLjg3IDEuMDYgNC4wOGwtMS4xIDQuMDQgNC4xNS0xLjA5YzEuMTcuNjQgMi41MSAxLjAxIDMuOTQgMS4wMSA0LjY5IDAgOC41LTMuODEgOC41LTguNVMxNi42OSAzLjUgMTIgMy41eiIvPjxwYXRoIGZpbGw9IiMyNUQzNjYiIGQ9Ik0xNi43NSAxNC40M2MtLjI3LS4xNS0xLjU4LS43OC0xLjgzLS44Ny0uMjQtLjA5LS40Mi0uMTMtLjU5LjEzLS4xOC4yNy0uNjguODctLjgzIDEuMDUtLjE2LjE4LS4zMS4yLS41OC4wNy0uMjctLjEzLTEuMTMtLjQyLTIuMTYtMS4zMy0uOC0uNzEtMS4zNC0xLjU5LTEuNS0xLjg2LS4xNi0uMjctLjAyLS40MS4xMi0uNTQuMTItLjEyLjI3LS4zMS40LS40Ny4xNC0uMTYuMTktLjI3LjI4LS40NS4wOS0uMTguMDUtLjM0LS4wMi0uNDctLjA3LS4xMy0uNTktMS40Mi0uODEtMS45NS0uMjEtLjUxLS40My0uNDQtLjU5LS40NS0uMTUgMC0uMzMtLjAxLS41MS0uMDEtLjE4IDAtLjQ3LjA3LS43Mi4zNC0uMjUuMjctLjk1LjkzLS45NSAyLjI3cy45NyAyLjYzIDEuMTEgMi44MWMuMTMuMTggMS44OCAyLjg3IDQuNTYgNC4wMiAyLjY3IDEuMTUgMi42Ny43NyAzLjE1LjcyLjQ4LS4wNSAxLjU4LS42NSAxLjgtMS4yNy4yMi0uNjIuMjItMS4xNi4xNi0xLjI3LS4wNy0uMTEtLjI1LS4xOC0uNTItLjMxeiIvPjwvc3ZnPg==',
  'download': 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8Y2lyY2xlIGN4PSIxMiIgY3k9IjEyIiByPSIxMiIgZmlsbD0iIzFFODhFNSIvPgogIDxnIHRyYW5zZm9ybT0idHJhbnNsYXRlKDEyLDEyKSBzY2FsZSgxLjIpIHRyYW5zbGF0ZSgtMTIsLTEyKSI+CiAgICA8cmVjdCB4PSIxMSIgeT0iNyIgd2lkdGg9IjIiIGhlaWdodD0iNiIgZmlsbD0id2hpdGUiLz4KICAgIDxwYXRoIGQ9Ik04IDEzIEwxMiAxNyBMMTYgMTMgWiIgZmlsbD0id2hpdGUiLz4KICA8L2c+CiAgPHJlY3QgeD0iNyIgeT0iMTciIHdpZHRoPSIxMCIgaGVpZ2h0PSIxLjUiIHJ4PSIwLjc1IiBmaWxsPSJ3aGl0ZSIvPgo8L3N2Zz4=',
  'link': 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Y2lyY2xlIGN4PSIxMiIgY3k9IjEyIiByPSIxMiIgZmlsbD0iIzNCODJGNiIvPjx0ZXh0IHg9IjEyIiB5PSIxNyIgZm9udC1zaXplPSIxNiIgdGV4dC1hbmNob3I9Im1pZGRsZSI+8J+UlzwvdGV4dD48L3N2Zz4=',
  'location': 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Y2lyY2xlIGN4PSIxMiIgY3k9IjEyIiByPSIxMiIgZmlsbD0iI0ZCQkYyNCIvPjx0ZXh0IHg9IjEyIiB5PSIxNyIgZm9udC1zaXplPSIxNiIgdGV4dC1hbmNob3I9Im1pZGRsZSI+8J+TjTwvdGV4dD48L3N2Zz4K',
  'email': 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Y2lyY2xlIGN4PSIxMiIgY3k9IjEyIiByPSIxMiIgZmlsbD0iIzZCNzI4MCIvPjx0ZXh0IHg9IjEyIiB5PSIxNyIgZm9udC1zaXplPSIxNiIgdGV4dC1hbmNob3I9Im1pZGRsZSI+4pyJ77iPPC90ZXh0Pjwvc3ZnPgo=',
  'phone': 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Y2lyY2xlIGN4PSIxMiIgY3k9IjEyIiByPSIxMiIgZmlsbD0iIzEwQjk4MSIvPjx0ZXh0IHg9IjEyIiB5PSIxNyIgZm9udC1zaXplPSIxNiIgdGV4dC1hbmNob3I9Im1pZGRsZSI+8J+TnjwvdGV4dD48L3N2Zz4K',
  'vcard': 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Y2lyY2xlIGN4PSIxMiIgY3k9IjEyIiByPSIxMiIgZmlsbD0iI0Y1OUUwQiIvPjx0ZXh0IHg9IjEyIiB5PSIxNyIgZm9udC1zaXplPSIxNiIgdGV4dC1hbmNob3I9Im1pZGRsZSI+8J+RpDwvdGV4dD48L3N2Zz4=',
  'enhanced-vcard': 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Y2lyY2xlIGN4PSIxMiIgY3k9IjEyIiByPSIxMiIgZmlsbD0iI0E4NTVGNyIvPjx0ZXh0IHg9IjEyIiB5PSIxNyIgZm9udC1zaXplPSIxNiIgdGV4dC1hbmNob3I9Im1pZGRsZSI+8J+qqjwvdGV4dD48L3N2Zz4='
};

const brandColorMap: Record<string, string> = {
  'facebook': '#1877F2',
  'instagram': '#E4405F',
  'twitter-bird': '#1DA1F2',
  'twitter-x': '#000000',
  'twitter': '#1DA1F2',
  'linkedin': '#007cb7',
  'youtube': '#FF0000',
  'paypal': '#003087',
  'zoom': '#2D8CFF',
  'wifi': '#60A5FA',
  'whatsapp': '#25D366',
  'download': '#1E88E5'
};

function isValidImageUrl(url: string): boolean {
  if (!url) return false;
  if (url.startsWith('data:image/')) return true;
  if (url.startsWith('http://') || url.startsWith('https://')) return true;
  if (url.startsWith('/') || url.startsWith('./')) return true;
  return false;
}

function isEmojiString(text: string): boolean {
  if (!text || text.trim().length === 0) return false;
  if (text.startsWith('data:') || text.startsWith('http') || text.startsWith('/')) return false;
  return text.trim().length <= 10;
}

async function convertEmojiToPNG(emoji: string): Promise<string> {
  return new Promise((resolve, reject) => {
    try {
      const canvas = document.createElement('canvas');
      const size = 200;
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        reject(new Error('Failed to get canvas context'));
        return;
      }

      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, size, size);

      ctx.font = `${size * 0.7}px Arial, sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(emoji.trim(), size / 2, size / 2);

      canvas.toBlob((blob) => {
        if (!blob) {
          reject(new Error('Failed to convert emoji to blob'));
          return;
        }
        
        const reader = new FileReader();
        reader.onloadend = () => {
          resolve(reader.result as string);
        };
        reader.onerror = () => {
          reject(new Error('Failed to read emoji blob'));
        };
        reader.readAsDataURL(blob);
      }, 'image/png');
    } catch (error) {
      reject(error);
    }
  });
}

export type QROptions = {
  data: string;
  size?: number;
  margin?: number;
  dotsType?: DotType;
  cornerSquareType?: CornerSquareType;
  cornerDotType?: CornerDotType;
  color?: {
    dark: string;
    light: string;
    innerEye?: string;
    outerEye?: string;
  };
  gradient?: {
    enabled: boolean;
    secondaryColor?: string;
    type?: 'linear' | 'radial';
  };
  errorCorrectionLevel?: 'L' | 'M' | 'Q' | 'H';
  design?: {
    logo?: string;
    logoSize?: number;
    logoOpacity?: number;
    logoBackgroundColor?: string;
    removeLogoBackground?: boolean;
  };
};

export const generateQRCode = async (options: QROptions): Promise<string> => {
  const {
    data,
    size = 300,
    margin = 4,
    dotsType = 'square',
    cornerSquareType = 'square',
    cornerDotType = 'square',
    color = { dark: '#000000', light: '#ffffff' },
    gradient,
    errorCorrectionLevel = 'M',
    design
  } = options;

  return new Promise(async (resolve, reject) => {
    try {
      if (!data || !data.trim()) {
        reject(new Error('QR code data cannot be empty'));
        return;
      }

      let logoUrl = design?.logo;
      if (logoUrl && logoUrl !== 'none' && brandIconMap[logoUrl]) {
        logoUrl = brandIconMap[logoUrl];
      }

      const isEmoji = logoUrl && logoUrl !== 'none' && isEmojiString(logoUrl);
      if (isEmoji && logoUrl) {
        try {
          logoUrl = await convertEmojiToPNG(logoUrl);
        } catch (emojiError) {
          console.warn('Failed to convert emoji to PNG, proceeding without logo:', emojiError);
          logoUrl = undefined;
        }
      }

      const hasValidLogo = logoUrl && logoUrl !== 'none' && isValidImageUrl(logoUrl);
      
      const qrCodeOptions: any = {
        width: size,
        height: size,
        type: 'canvas',
        data: data.trim(),
        margin: margin,
        qrOptions: {
          typeNumber: 0,
          mode: 'Byte',
          errorCorrectionLevel: hasValidLogo ? 'H' : errorCorrectionLevel
        },
        dotsOptions: gradient?.enabled ? {
          type: dotsType,
          gradient: {
            type: gradient.type === 'radial' ? 'radial' : 'linear',
            rotation: 0,
            colorStops: [
              { offset: 0, color: color.dark },
              { offset: 1, color: gradient.secondaryColor || color.dark }
            ]
          }
        } : {
          color: color.dark,
          type: dotsType
        },
        backgroundOptions: {
          color: color.light,
        },
        cornersSquareOptions: {
          color: color.outerEye || color.dark,
          type: cornerSquareType
        },
        cornersDotOptions: {
          color: color.innerEye || color.dark,
          type: cornerDotType
        }
      };

      if (hasValidLogo) {
        qrCodeOptions.image = logoUrl;
        qrCodeOptions.imageOptions = {
          hideBackgroundDots: design?.removeLogoBackground !== false,
          imageSize: (design?.logoSize || 20) / 100,
          margin: 5,
          crossOrigin: 'anonymous',
        };
        
        if (design?.logoOpacity !== undefined && design.logoOpacity < 100) {
          qrCodeOptions.imageOptions.opacity = design.logoOpacity / 100;
        }
      }

      const qrCode = new QRCodeStyling(qrCodeOptions);

      qrCode.getRawData('png').then(data => {
        if (!data) {
          reject(new Error('Failed to generate QR code: getRawData returned null'));
          return;
        }

        const blob = data instanceof Blob ? data : new Blob([data], { type: 'image/png' });
        const reader = new FileReader();
        reader.onloadend = () => {
          resolve(reader.result as string);
        };
        reader.onerror = () => {
          reject(new Error('Failed to read QR code data'));
        };
        reader.readAsDataURL(blob);
      }).catch(error => {
        reject(error);
      });

    } catch (error) {
      reject(error);
    }
  });
};

export const generateQRCodeSVG = async (options: QROptions): Promise<string> => {
  const {
    data,
    size = 300,
    margin = 4,
    dotsType = 'square',
    cornerSquareType = 'square',
    cornerDotType = 'square',
    color = { dark: '#000000', light: '#ffffff' },
    gradient,
    errorCorrectionLevel = 'M',
    design
  } = options;

  return new Promise(async (resolve, reject) => {
    try {
      if (!data || !data.trim()) {
        reject(new Error('QR code data cannot be empty'));
        return;
      }

      let logoUrl = design?.logo;
      if (logoUrl && logoUrl !== 'none' && brandIconMap[logoUrl]) {
        logoUrl = brandIconMap[logoUrl];
      }

      const isEmoji = logoUrl && logoUrl !== 'none' && isEmojiString(logoUrl);
      if (isEmoji && logoUrl) {
        try {
          logoUrl = await convertEmojiToPNG(logoUrl);
        } catch (emojiError) {
          console.warn('Failed to convert emoji to PNG, proceeding without logo:', emojiError);
          logoUrl = undefined;
        }
      }

      const hasValidLogo = logoUrl && logoUrl !== 'none' && isValidImageUrl(logoUrl);
      
      const qrCodeOptions: any = {
        width: size,
        height: size,
        type: 'svg',
        data: data.trim(),
        margin: margin,
        qrOptions: {
          typeNumber: 0,
          mode: 'Byte',
          errorCorrectionLevel: hasValidLogo ? 'H' : errorCorrectionLevel
        },
        dotsOptions: gradient?.enabled ? {
          type: dotsType,
          gradient: {
            type: gradient.type === 'radial' ? 'radial' : 'linear',
            rotation: 0,
            colorStops: [
              { offset: 0, color: color.dark },
              { offset: 1, color: gradient.secondaryColor || color.dark }
            ]
          }
        } : {
          color: color.dark,
          type: dotsType
        },
        backgroundOptions: {
          color: color.light,
        },
        cornersSquareOptions: {
          color: color.outerEye || color.dark,
          type: cornerSquareType
        },
        cornersDotOptions: {
          color: color.innerEye || color.dark,
          type: cornerDotType
        }
      };

      if (hasValidLogo) {
        qrCodeOptions.image = logoUrl;
        qrCodeOptions.imageOptions = {
          hideBackgroundDots: design?.removeLogoBackground !== false,
          imageSize: (design?.logoSize || 20) / 100,
          margin: 5,
          crossOrigin: 'anonymous',
        };
        
        if (design?.logoOpacity !== undefined && design.logoOpacity < 100) {
          qrCodeOptions.imageOptions.opacity = design.logoOpacity / 100;
        }
      }

      const qrCode = new QRCodeStyling(qrCodeOptions);

      qrCode.getRawData('svg').then(data => {
        if (!data) {
          reject(new Error('Failed to generate SVG QR code: getRawData returned null'));
          return;
        }

        const blob = data instanceof Blob ? data : new Blob([data], { type: 'image/svg+xml' });
        const reader = new FileReader();
        reader.onloadend = () => {
          resolve(reader.result as string);
        };
        reader.onerror = () => {
          reject(new Error('Failed to read SVG QR code data'));
        };
        reader.readAsDataURL(blob);
      }).catch(error => {
        reject(error);
      });

    } catch (error) {
      reject(error);
    }
  });
};

export const createUrlQR = (url: string): string => {
  if (!url || !url.trim()) {
    return '';
  }
  
  let cleanUrl = url.trim();
  if (!/^[a-zA-Z][a-zA-Z\d+\.-]*:/.test(cleanUrl)) {
    cleanUrl = `https://${cleanUrl}`;
  }
  
  return cleanUrl;
};

export const createEmailQR = (email: string, subject?: string, body?: string): string => {
  if (!email || !email.trim()) {
    return '';
  }
  
  let mailto = `mailto:${email.trim()}`;
  const params: string[] = [];
  
  if (subject && subject.trim()) {
    params.push(`subject=${encodeURIComponent(subject.trim())}`);
  }
  if (body && body.trim()) {
    params.push(`body=${encodeURIComponent(body.trim())}`);
  }
  
  if (params.length > 0) {
    mailto += `?${params.join('&')}`;
  }
  
  return mailto;
};

export const createPhoneQR = (phoneNumber: string): string => {
  if (!phoneNumber || !phoneNumber.trim()) {
    return '';
  }
  
  const cleanNumber = phoneNumber.trim().replace(/\s+/g, '');
  return `tel:${cleanNumber}`;
};

export const createTextQR = (text: string): string => {
  return text || '';
};

export const createSMSQR = (phoneNumber: string, message?: string): string => {
  if (!phoneNumber || !phoneNumber.trim()) {
    return '';
  }
  
  const cleanNumber = phoneNumber.trim().replace(/\s+/g, '');
  let sms = `sms:${cleanNumber}`;
  
  if (message && message.trim()) {
    sms += `?body=${encodeURIComponent(message.trim())}`;
  }
  
  return sms;
};

export const createWhatsAppQR = (phoneNumber: string, message?: string): string => {
  if (!phoneNumber || !phoneNumber.trim()) {
    return '';
  }
  
  let cleanNumber = phoneNumber.trim().replace(/\s+/g, '');
  if (cleanNumber.startsWith('+')) {
    cleanNumber = cleanNumber.substring(1);
  }
  
  let whatsappUrl = `https://wa.me/${cleanNumber}`;
  
  if (message && message.trim()) {
    whatsappUrl += `?text=${encodeURIComponent(message.trim())}`;
  }
  
  return whatsappUrl;
};

export const createWiFiQR = (ssid: string, password: string, security: string = 'WPA'): string => {
  if (!ssid || !ssid.trim()) {
    return '';
  }
  
  return `WIFI:T:${security};S:${ssid.trim()};P:${password.trim()};;`;
};

export const createVCardQR = (name: string, phone?: string, email?: string, organization?: string): string => {
  if (!name || !name.trim()) {
    return '';
  }
  
  let vcard = 'BEGIN:VCARD\nVERSION:3.0';
  vcard += `\nFN:${name.trim()}`;
  
  if (phone && phone.trim()) {
    vcard += `\nTEL:${phone.trim()}`;
  }
  if (email && email.trim()) {
    vcard += `\nEMAIL:${email.trim()}`;
  }
  if (organization && organization.trim()) {
    vcard += `\nORG:${organization.trim()}`;
  }
  
  vcard += '\nEND:VCARD';
  
  return vcard;
};

export const createEventQR = (title: string, location?: string, description?: string, startDate?: string, endDate?: string): string => {
  if (!title || !title.trim()) {
    return '';
  }
  
  const params = new URLSearchParams();
  params.append('text', title.trim());
  
  if (location && location.trim()) {
    params.append('location', location.trim());
  }
  if (description && description.trim()) {
    params.append('details', description.trim());
  }
  
  const formatDate = (dateStr: string): string => {
    const date = new Date(dateStr);
    return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  };
  
  if (startDate) {
    params.append('dates', `${formatDate(startDate)}/${endDate ? formatDate(endDate) : formatDate(startDate)}`);
  }
  
  return `https://www.google.com/calendar/render?action=TEMPLATE&${params.toString()}`;
};

export const createImageQR = (imageData: string): string => {
  if (!imageData) {
    return '';
  }
  
  return imageData;
};

export const createPayPalQR = (
  email: string,
  paymentType: string = 'Buy now',
  itemName?: string,
  itemId?: string,
  price?: string,
  currency: string = 'USD',
  shipping?: string,
  taxRate?: string
): string => {
  if (!email || !email.trim()) {
    return '';
  }
  
  const baseUrl = 'https://www.paypal.com/cgi-bin/webscr';
  const params = new URLSearchParams();
  
  params.append('cmd', '_xclick');
  params.append('business', email.trim());
  
  if (itemName && itemName.trim()) {
    params.append('item_name', itemName.trim());
  }
  
  if (itemId && itemId.trim()) {
    params.append('item_number', itemId.trim());
  }
  
  if (price && price.trim()) {
    params.append('amount', price.trim());
  }
  
  params.append('currency_code', currency);
  
  if (shipping && shipping.trim()) {
    params.append('shipping', shipping.trim());
  }
  
  if (taxRate && taxRate.trim()) {
    params.append('tax_rate', taxRate.trim());
  }
  
  return `${baseUrl}?${params.toString()}`;
};

export const createEnhancedVCardQR = (
  version: string = '3.0',
  title?: string,
  firstName?: string,
  lastName?: string,
  phoneHome?: string,
  phoneMobile?: string,
  phoneOffice?: string,
  fax?: string,
  email?: string,
  website?: string,
  company?: string,
  jobTitle?: string,
  address?: string,
  city?: string,
  state?: string,
  postalCode?: string,
  country?: string
): string => {
  if ((!firstName || !firstName.trim()) && (!lastName || !lastName.trim())) {
    return '';
  }
  
  let vcard = `BEGIN:VCARD\nVERSION:${version}`;
  
  const fullName = [firstName?.trim(), lastName?.trim()].filter(Boolean).join(' ');
  if (fullName) {
    vcard += `\nFN:${fullName}`;
  }
  
  if (lastName?.trim() || firstName?.trim()) {
    vcard += `\nN:${lastName?.trim() || ''};${firstName?.trim() || ''};;;`;
  }
  
  if (title && title.trim()) {
    vcard += `\nTITLE:${title.trim()}`;
  }
  
  if (phoneHome && phoneHome.trim()) {
    vcard += `\nTEL;TYPE=HOME:${phoneHome.trim()}`;
  }
  if (phoneMobile && phoneMobile.trim()) {
    vcard += `\nTEL;TYPE=CELL:${phoneMobile.trim()}`;
  }
  if (phoneOffice && phoneOffice.trim()) {
    vcard += `\nTEL;TYPE=WORK:${phoneOffice.trim()}`;
  }
  if (fax && fax.trim()) {
    vcard += `\nTEL;TYPE=FAX:${fax.trim()}`;
  }
  
  if (email && email.trim()) {
    vcard += `\nEMAIL:${email.trim()}`;
  }
  
  if (website && website.trim()) {
    let cleanWebsite = website.trim();
    if (!/^[a-zA-Z][a-zA-Z\d+\.-]*:/.test(cleanWebsite)) {
      cleanWebsite = `https://${cleanWebsite}`;
    }
    vcard += `\nURL:${cleanWebsite}`;
  }
  
  if (company && company.trim()) {
    vcard += `\nORG:${company.trim()}`;
  }
  if (jobTitle && jobTitle.trim()) {
    vcard += `\nTITLE:${jobTitle.trim()}`;
  }
  
  if (address || city || state || postalCode || country) {
    const addressParts = [
      '',
      '',
      address?.trim() || '',
      city?.trim() || '',
      state?.trim() || '',
      postalCode?.trim() || '',
      country?.trim() || ''
    ];
    vcard += `\nADR:${addressParts.join(';')}`;
  }
  
  vcard += '\nEND:VCARD';
  
  return vcard;
};

export const createZoomQR = (meetingId: string, password?: string): string => {
  if (!meetingId || !meetingId.trim()) {
    return '';
  }
  
  const cleanMeetingId = meetingId.trim().replace(/\s+/g, '');
  
  let zoomUrl = `https://zoom.us/j/${cleanMeetingId}`;
  
  if (password && password.trim()) {
    zoomUrl += `?pwd=${password.trim()}`;
  }
  
  return zoomUrl;
};

export const availableDotStyles: { value: DotType; label: string; preview: string }[] = [
  { value: 'square', label: 'Square', preview: '⬛' },
  { value: 'rounded', label: 'Rounded', preview: '⬜' },
  { value: 'dots', label: 'Dots', preview: '●' },
  { value: 'classy', label: 'Classy', preview: '◆' },
  { value: 'classy-rounded', label: 'Classy Rounded', preview: '◈' },
  { value: 'extra-rounded', label: 'Extra Rounded', preview: '◉' }
];

export const availableCornerStyles: { value: CornerSquareType; label: string; preview: string }[] = [
  { value: 'square', label: 'Square', preview: '▪' },
  { value: 'dot', label: 'Dot', preview: '●' },
  { value: 'extra-rounded', label: 'Extra Rounded', preview: '◉' }
];

export const availableCornerDotStyles: { value: CornerDotType; label: string; preview: string }[] = [
  { value: 'square', label: 'Square', preview: '▪' },
  { value: 'dot', label: 'Dot', preview: '●' }
];

export { brandIconMap, brandColorMap };
