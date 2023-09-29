//! PANEL CALCULATOR

// Inputs: Width, Length, Roof Pitch, Eave Height

// GLOBAL : RiseOfRoof = (width / 2) * (Roof Pitch /12)

/*Output:

-HHR 3' Panels Needed = (length *12) /36 * 2 .roundup()
-RSS 18" Panels Needed = (length *12) /18 * 2 .roundup()
-Panel Length = (Width / 2) + RiseOfRoof
-Ridge height = (width / 2) * roofPitch / 12 + eave height

// ! ROOF FASTENER CALCULATOR

Outputs:
HHR: 
Structural Screws (3' Purlin Spacing) = ((Panel Length / 3) - 2) * 3 + 15) * HHR 3' Panels Needed 
Stitch Screws =  (Panel Length  * HHR 3' Panels Needed) /2 * 1.1
Closures = HHR 3' Panels Needed * 2


RSS:
Sturctural Screws (3' Purlin Spacing) = (RSS 18" Panels Needed * 8) * 1.1
RSS Clips (3' Purlin Spacing) = ((Panel Length /3) * HHR 3' Panels Needed) * 1.1
Panhead Screws for RSS Clips = RSS Clips (3' Purlin Spacing) * 2
Closures = RSS 18" Panels Needed

*/
