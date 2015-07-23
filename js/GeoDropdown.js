// GeoDropdown object
var geoDropdown = function(continent,country,adm1,adm2,adm3,adm4,adm5){
	this.continent = continent;
	this.country = country;
	this.adm1 = adm1;
	this.adm2 = adm2;
	this.adm3 = adm3;
	this.adm4 = adm4;
	this.adm5 = adm5;

	// 3D array with all the hierarchical information
	this.levels = new Array;
	this.names = new Array;
	this.level = -1;

	// Server request variables
	this.defaultLang;
	this.geoParent;
	this.g;

	// continent dropdown variables
	this.continentElement;
	this.selectedContinentIndex;
	this.selectedContinentText;

	// country dropdown variables
	this.countryElement;
	this.selectedCountryIndex;
	this.selectedCountryText;

	// adm1 dropdown variables
	this.adm1Element;
	this.selectedADM1Index;
	this.selectedADM1Text;

	// adm2 dropdown variables
	this.adm2Element;
	this.selectedADM2Index;
	this.selectedADM2Text;
	
	// adm3 dropdown variables
	this.adm3Element;
	this.selectedADM3Index;
	this.selectedADM3Text;
	
	// adm4 dropdown variables
	this.adm4Element;
	this.selectedADM4Index;
	this.selectedADM4Text;

	// adm5 dropdown variables
	this.adm5Element;
	this.selectedADM5Index;
	this.selectedADM5Text;
}

geoDropdown.prototype.geoReady = function(){
	// browser default lang
	defaultLang = navigator.language /* Mozilla */ || navigator.userLanguage /* IE */;

	// entry point
	if(this.continent!="continent")
		this.geoClick($("#earth"));
	else
	{
		this.geoClick($("#africa"));
		this.geoClick($("#antarctica"));
		this.geoClick($("#asia"));
		this.geoClick($("#europe"));
		this.geoClick($("#north_america"));
		this.geoClick($("#oceania"));
		this.geoClick($("#south_america"));
	}
}

geoDropdown.prototype.geoClick = function(geo) {
	this.geoParent = geo.parent();
	var self = this;
	// server request
	$.ajax({
		url: 'http://geotree.geonames.net/childrenJSON',
		dataType:'jsonp',
		data: {
			geonameId: geo.attr("gid"),
			token: 'eertoeg',
			maxRows: 999,
			style: 'full',
			lang: defaultLang
		},
		success: function(response) {
			// ws returns an error message
			if (response.status) {
				$("#alert").html(response.status.message+' ('+response.status.value+')').show();
			}
			// ws returns an array of data
			if (response.geonames && response.geonames.length) {
				self.g = new Array;
				$.each(response.geonames, function() {
					// add hierarchy as title
					var title = '';
					if (this.fcode=='CONT' && this.continentCode) 
					{ 
						title = this.continentCode; 
						if(self.continent!="continent") self.level=0; 
					}
					else if (this.countryCode && this.fcl!=='P') {
						title += this.countryCode;
						if (this.adminCode1) {
							title += '-'+this.adminCode1;
							if (this.adminCode2) {
								title += '-'+this.adminCode2;
								if (this.adminCode3) {
									title += '-'+this.adminCode3;
									if (this.adminCode4) {
										title += '-'+this.adminCode4;
										if (this.adminCode5) {
											title += '-'+this.adminCode5;
										}
									}
								}
							}
						}
					}
					// empty adminCode1 for some countries
					if (title.length==5) title = title.replace('-00','');
					// add code to item name
					var gcode = '';
					if (this.fcl!=='P') {
						gcode = title;
						var s = gcode.split('-');
						for (var i=1; i<=5; i++) if (this.fcode=='ADM'+i) gcode = s[i];
					}
					self.g.push('<li><a href="#" sort="'+asciiName(this.name)+'" title="'+title+'" fcode="'+this.fcode+'" gid="'+this.geonameId+'" class="id_'+this.geonameId+'">'+this.name+gcode+'</a></li>');
                    self.names.push(this.name+"gcode"+gcode);
				});

				if(self.continent=="continent") 
					if(self.level==-1) 
						if(self.names.length<248) { self.geoParent.append('<ol>'+self.g.join('')+'</ol>'); return; }
						else self.level=1;
				
				// Ensure that all data will be correct
				if(self.names==null || self.names=={}) return;
				self.names = $.unique(self.names).sort();
				
				for(i=0;i<7;i++){
					if(i!=self.level && self.levels[i] != undefined){
						if(self.levels[i][0] == self.names[0]) return; 
					}
				}
               
                // add the required data to 3D array
                self.levels[self.level] = self.names;

                switch(self.level)
                {
                    case 0: { populateContinents(self); break; } 
                    case 1: { populateCountries(self); break; }
                    case 2: { populateADM1(self); break; }
                    case 3: { populateADM2(self); break; }
                    case 4: { populateADM3(self); break; }
                    case 5: { populateADM4(self); break; }
                    case 6: { populateADM5(self); break; }
                }
			}
		},
		error: function() {
			// error handling goes here
			$("#alert").html('ws timeout').show();
		}
	});
}

// Replace to provide names in the correct ascii code
asciiName = function(s){
    var r = s.toLowerCase();
    r = r .replace(/\\s/g, "");
    r = r .replace(/[àáâãäå]/g, "a");
    r = r .replace(/æ/g, "ae");
    r = r .replace(/ç/g, "c");
    r = r .replace(/[èéêë]/g, "e");
    r = r .replace(/[ìíîï]/g, "i");
    r = r .replace(/ñ/g, "n");
    r = r .replace(/[òóôõö]/g, "o");
    r = r .replace(/œ/g, "oe");
    r = r .replace(/[ùúûü]/g, "u");
    r = r .replace(/[ýÿ]/g, "y");
    r = r .replace(/\\W/g, "a");
    return r;
};

function stripGCode(string){
    return string.replace(/gcode(.)*/,'');
}