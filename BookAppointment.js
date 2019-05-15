<html><head>
  <title>Book Appointment</title>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1"> 
  <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css">
  <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.4.0/jquery.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.7/umd/popper.min.js"></script>
  <script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.3.1/js/bootstrap.min.js"></script>
  <script src="ClientGlobalContext.js.aspx" type="text/javascript"></script>

  
<meta><meta><meta><meta><meta><meta><meta><meta><meta><meta><meta><meta><meta><meta><meta></head>
<body class="vsc-initialized" style="overflow-wrap: break-word;" onload="GetSpecialty()">

<div class="container" style="font-family: undefined;">
<br>
<br>
          
		  <form>
			<div>
				<div class="form-group">
					<select id="dd1" name="dd1" class="form-control" onmousedown="this.value='';" onchange="jsFunction(this.value);" required>
					<option value="" disabled="" selected="" hidden="">Speciality</option>

				</select>
                </div><br>
				<div class="form-group">
					<select id="dd2" name="dd2" class="form-control" required>
					  <option value="" disabled="" selected="" hidden="">Sub Speciality</option>
					</select>
				</div><br>
				<div class="form-group">
				<select id="dd3" name="dd3" class="form-control" required>
                <option value="" disabled="" selected="" hidden="">Location</option>

				</select>
				</div>
				<br>
				<div class="form-group">
					<label>Date For Appointment</label>
					<input id="appDate" class="form-control" type="date" required>
				</div>
				
					<button type="button" class="btn btn-primary" onclick="SearchAppointment()">Search</button>
				
			</div>
			
         </form> 
		 <div id="doclist" style="display:none;border:1px;">
         	
			<div class="container">
			            
			  <table class="table" id="DocTable">
				<thead>
					<tr>
						<th>
						
						 Doctor
				
						</th>
						<th colspan="6">
						
						 
						  Available Times
						
						</th>
					</tr>
				</thead>
				<tbody>
				
				</tbody>  
			  </table>
			  
			</div>
			<div class="form-group">
				<button type="button" class="btn btn-primary" onclick="bookAppointment()">Book Appointment</button>
			</div>
         </div>
		  
        
  
</div>


		<script>
				// Get Specialty from "sps_specialties" entity
				function GetSpecialty()
				{
					GetHolidayList();
					var oDataUri = Xrm.Utility.getGlobalContext().getClientUrl() + "/api/data/v9.0/sps_specialties?$select=sps_name,sps_specialtyid";
					console.log(oDataUri);
					var filterData = jquerycall(oDataUri);
					console.log(filterData+"outside if");
					//console.log(filterData);
					if (filterData != null && filterData[0].length > 0)
					{
						console.log("inside if");
						
						console.log("suman");
						console.log(filterData.length);
						
						for (var count = 0; count < filterData[0].length; count++) 
						{
							
							var option1 = document.createElement("option");
							option1.text = filterData[0][count].sps_name;
							option1.value = filterData[0][count].sps_specialtyid;
							document.getElementById("dd1").append(option1);
							//console.log(AvailabelDoctors[0][j]);							
					
						}
						//console.log("suitableDoctors"+SuitableDoctors[0]);
					}
					var oDataUri = Xrm.Utility.getGlobalContext().getClientUrl() + "/api/data/v9.0/sps_locations?$select=sps_name,sps_locationid";
					console.log(oDataUri);
					var filterData = jquerycall(oDataUri);
					console.log(filterData+"outside if");
					//console.log(filterData);
					if (filterData != null && filterData[0].length > 0)
					{
						console.log("inside if");
						
						console.log("suman");
						console.log(filterData.length);
						
						for (var count = 0; count < filterData[0].length; count++) 
						{
							
							var option1 = document.createElement("option");
							option1.text = filterData[0][count].sps_name;
							option1.value = filterData[0][count].sps_locationid;
							document.getElementById("dd3").append(option1);
							//console.log(AvailabelDoctors[0][j]);							
					
						}
						//console.log("suitableDoctors"+SuitableDoctors[0]);
					}

				}
				
				// Call Global Action to create a Appointment for Patient and make Opportunity as Won and Create a Order.
				function bookAppointment() {
					
					var url = window.location.href.substring(window.location.href.indexOf("Data=")+6).replace("}", "");
					
					//var e = document.getElementById("dd4"); 
					var doctor = document.querySelector('input[name="optradio"]:checked').id; 
					console.log(doctor);
					//doctor = parseInt(document.querySelector('input[name="optradio"]:checked').id); 
					//console.log(doctor);
					var docName = document.querySelector('input[name="optradio"]:checked').dataset.docName
					var docFee = parseFloat(document.querySelector('input[name="optradio"]:checked').dataset.fee);
					//e = document.getElementById("dd5"); 
					var timeslot = document.querySelector('input[name="optradio"]:checked').value;
					var tim = timeslot.split("-");
					e = document.getElementById("appDate"); 
					
					var startdate = new Date(e.value+' '+ tim[0] + ':00:00');
					var enddate = new Date(e.value +' '+ tim[1] + ':00:00');
					var data = { 
						 "Subject": "Create an appointment",
						 "Fee" : docFee,
						 "StartDateTime" : startdate,
						 "EndDateTime" : enddate,
						 "Doctor":
									{
										  "@odata.type": "Microsoft.Dynamics.CRM.sps_doctor",//entity type
										  "sps_doctorid": doctor,//Record's guid
										  "sps_name": docName//name field of the account entity
									}
						
					};
					var query = "opportunities("+url+")/Microsoft.Dynamics.CRM.new_AppointmentAct"; 
					var req = new XMLHttpRequest(); 
					req.open("POST", Xrm.Utility.getGlobalContext().getClientUrl() + "/api/data/v9.0/" + query, true); 
					req.setRequestHeader("Accept", "application/json"); 
					req.setRequestHeader("Content-Type", "application/json; charset=utf-8"); 
					req.setRequestHeader("OData-MaxVersion", "4.0"); 
					req.setRequestHeader("OData-Version", "4.0"); 
					req.onreadystatechange = function () { 
						if (this.readyState == 4) {
							req.onreadystatechange = null; 
							if (this.status == 200) { 
								alert("Action called successfully");
							} else { 
								var error = JSON.parse(this.response).error; 
								alert(error.message); 
							} 
						} 
					};
					req.send(window.JSON.stringify(data));
				}

				// Get the Specialty, Subspecilty, Location, Date and pass these data to API and retrive the available doctors
				function SearchAppointment()
				{
					var e = document.getElementById("dd1"); 
					var spec_value = e.options[e.selectedIndex].value; 
					e = document.getElementById("dd2");
					var subspec_value = e.options[e.selectedIndex].value; 
					e = document.getElementById("dd3");
					var location = e.options[e.selectedIndex].value; 
					e = document.getElementById("appDate");
					var appdate = e.value;
					var SuitableDoctors = [];
					var DoctorsOnLeave = [];
					var AvailabelDoctors= [];
					var request = new XMLHttpRequest(); 
					
					var oDataUri = Xrm.Utility.getGlobalContext().getClientUrl() + "/api/data/v9.0/sps_doctors?$select=sps_name,sps_doctorid,sps_fee&$filter=_sps_subspecialty_value eq '"+subspec_value+"' and _sps_specialty_value eq '"+spec_value+"' and _sps_location_value eq '"+location+"'";
					//alert(oDataUri);
					debugger;
					console.log(oDataUri);
					var filterData = jquerycall(oDataUri);
					
					
					
					
					//alert(filterData+"outside if");
					console.log(filterData);
						if (filterData != null && filterData[0].length > 0)
						{
							//alert("inside if");
							
							console.log("suman");
							console.log(filterData.length);
							
							for (var count = 0; count < filterData[0].length; count++) 
							{
									SuitableDoctors.push({name: filterData[0][count].sps_name, doctorId: filterData[0][count].sps_doctorid, fee: filterData[0][count].sps_fee});
								
							}
							console.log("suitableDoctors"+SuitableDoctors[0]);
						}
						oDataUri =Xrm.Utility.getGlobalContext().getClientUrl()+ "/api/data/v9.0/sps_holidaies?$select=_sps_doctorname_value&$filter=sps_holidatestartdate lt '"+appdate+"' and sps_holidayenddate gt '"+appdate+"'"
						filterData = jquerycall(oDataUri);
						if (filterData != null && filterData[0].length > 0)
						{
							//alert("inside if");
							
							//console.log("suman");
							//console.log(filterData.length);
							
							for (var count = 0; count < filterData[0].length; count++) 
							{
								
								console.log();
								
								DoctorsOnLeave.push(filterData[0][count]._sps_doctorname_value);
								
							}
							console.log("DoctorsOnLeave"+ DoctorsOnLeave);
						}
						for( var i=0; i<SuitableDoctors.length;i++)
						{
							if(!contains(AvailabelDoctors,SuitableDoctors[i].doctorId))
							{
								AvailabelDoctors.push({Docname : SuitableDoctors[i].name,DocID : SuitableDoctors[i].doctorId,fee : SuitableDoctors[i].fee});
								console.log(SuitableDoctors[i].name);
							}
							
						}
						function contains(arr, element) 
						{ 
							for (var i = 0; i < arr.length; i++)
							{ 
								if (arr[i] === element) 
								{ 
									return true; 
								} 
							} 
							return false; 
						} 
						document.getElementById('doclist').style.display = "block";
						for(var j=0;j<AvailabelDoctors.length;j++)
						{
							var table = document.getElementById("DocTable");
							var row = table.insertRow(j+1);
							var cell1 = row.insertCell(0);
							
							cell1.innerHTML = AvailabelDoctors[j].Docname;
							oDataUri =Xrm.Utility.getGlobalContext().getClientUrl()+ "/api/data/v9.0/sps_timeslots?$select=sps_timeslots&$filter=_sps_doctor_value eq '"+AvailabelDoctors[j].DocID+"'"
							filterData = jquerycall(oDataUri);
							for(var k=0;k<filterData[0].length;k++)
							{
								var cell2 = row.insertCell(k+1);
								//cell1.innerHTML = filterData[0][j].sps_timeslots;
								var div = document.createElement('div');

								div.className = 'row';

								div.innerHTML =
									'<div class="radio"><label><input type="radio" data-docName="'+AvailabelDoctors[j].Docname+'" data-fee='+AvailabelDoctors[j].fee+' name="optradio" id="'+AvailabelDoctors[j].DocID+'" value="'+filterData[0][k].sps_timeslots+'">'+filterData[0][k].sps_timeslots+'</label></div>';

								cell2.appendChild(div);
							}
							
							
						}
						
				}
				
			// Get the Subspecilty details based on Specialty selected.	
			function jsFunction(value)
			{
		
					var oDataUri = Xrm.Utility.getGlobalContext().getClientUrl()+"/api/data/v9.0/sps_subspecialties?$select=sps_name,sps_subspecialtyid&$filter=_sps_specialty_value eq '"+value+"'";
					console.log(oDataUri);
					var filterData = jquerycall(oDataUri);
					console.log(filterData+"outside if");
					document.getElementById("dd2").options.length=0;
					
					var option0 = document.createElement("option");
					option0.text = "Sub Speciality";
					option0.value = "null";
					option0.hidden=true;
					option0.selected = "selected";
					option0.disabled = true;
							
					//document.getElementById("dd4").append(option0);
					//console.log(filterData);
						if (filterData != null && filterData[0].length > 0)
						{
							console.log("inside if");
							
							console.log("suman");
							console.log(filterData.length);
							
							for (var count = 0; count < filterData[0].length; count++) 
							{
								
								var option1 = document.createElement("option");

								option1.text = filterData[0][count].sps_name;
								option1.value = filterData[0][count].sps_subspecialtyid;
								document.getElementById("dd2").append(option1);
								//console.log(AvailabelDoctors[0][j]);							
						
							}
							//console.log("suitableDoctors"+SuitableDoctors[0]);
						}

			} 
			
			// Call API based on Odata URI
			function jquerycall(oDataUri)
					{
						var jSonArray = new Array();
						jQuery.ajax
						({
							type: "GET",
							contentType: "application/json; charset=utf-8",
							datatype: "json",
							url: oDataUri,
							async: false,
							beforeSend: function (XMLHttpRequest) {
								//Specifying this header ensures that the results will be returned as JSON.            
								XMLHttpRequest.setRequestHeader("Accept", "application/json");
							},
							success: function (data, textStatus, XmlHttpRequest) {
							//alert("Success");
							//alert(data);
							console.log(data);
							console.log(data.value);
								if (data != null && data.value != null) {
									jSonArray.push(data.value);
								}
							},
							error: function (XmlHttpRequest, textStatus, errorThrown) {
								//alert("Error :  has occured during retrieval of the contacts");
							}
						});
						return jSonArray;
					}
					
					// Get the Holiday schedules and parse that and then get the CalenderRules(Holidays) present in 
					// the specific Holiday schedule
					function GetHolidayList()
					{
							var holidaysList =[];
							var oDataUri = Xrm.Utility.getGlobalContext().getClientUrl()+"/api/data/v9.0/calendars?$filter=type%20eq%202&$select=calendarid";
							filterData = jquerycall(oDataUri);
							var calenderIdList=[];
							if (filterData != null && filterData[0].length > 0)
							{
								for (var count = 0; count < filterData[0].length; count++) 
								{
										calenderIdList.push(filterData[0][count].calendarid);
									
								}
							}
							for (var count = 0; count <calenderIdList.length; count++) 
							{
								oDataUri = Xrm.Utility.getGlobalContext().getClientUrl()+"/api/data/v9.0/calendars("+calenderIdList[count]+")/calendar_calendar_rules";
								filterData = jquerycall(oDataUri);
								for (var count = 0; count < filterData[0].length; count++) 
								{
									holidaysList.push({startDate: filterData[0][count].effectiveintervalstart, endDate: filterData[0][count].effectiveintervalend, holidayName: filterData[0][count].name});
									
								}
							}
							return holidaysList;
					}
        
         </script>


</body></html>