function populateCountries(self, instanceLocal){
	// Country View
	if(self.continent=="default_continent") $('select[id="' + self.continent + '"]').hide();
	$('select[id="' + self.country + '"]').show();
	$('select[id="' + self.adm1 + '"]').hide()
	$('select[id="' + self.adm2 + '"]').hide()
	$('select[id="' + self.adm3 + '"]').hide()
	$('select[id="' + self.adm4 + '"]').hide()
	$('select[id="' + self.adm5 + '"]').hide()

	countryElement = document.getElementById( self.country );
	
	if(document.getElementById( self.country ).selectedIndex != 0)
		self.selectedCountryIndex = document.getElementById( self.country ).selectedIndex;

	countryElement.length=1;

	// init country dropdown list
	if(self.selectedContinentIndex<0 && self.answer!=undefined && JSON.parse(self.answer)[0]['country']){
		countryElement.options[0] = new Option(stripGCode(JSON.parse(self.answer)[0]['country']),'');
		self.selectedCountryText = JSON.parse(self.answer)[0]['country'];
	}
	else countryElement.options[0] = new Option('Select Country','');
	countryElement.selectedIndex = 0;
	
	// Get all country names (not the official ones)
	for(i=0,x=self.levels[1].length;i<x;i++) self.levels[1][i] = getCountryName(self.levels[1][i].substring(self.levels[1][i].length-2,self.levels[1][i].length))
	self.levels[1] = $.unique(self.levels[1]).sort();

	// Fill the dropdown
	for(i=0,x=self.levels[1].length;i<x;i++)
	 	countryElement.options[countryElement.length] = new Option(self.levels[1][i],self.levels[1][i]);

	self.names = new Array;
	self.geoParent.append('<ol>'+self.g.join('')+'</ol>');

	// Assigned all countries. Now assign event listener for the adm1.
	if( self.adm1 ){
		$('select[id="' + self.country + '"]').change(function(){
			// Ask for country code again, in order to make a correct server request
			self.selectedCountryText = getCountryCode(isoCountries,$('select[id="' + self.country + '"] option:selected').text());
			
			// Clear and deselect the following dropdowns
			self.selectedADM1Index=self.selectedADM2Index=self.selectedADM3Index=self.selectedADM4Index=self.selectedADM5Index=-1;
			self.selectedADM1Text=self.selectedADM2Text=self.selectedADM3Text=self.selectedADM4Text=self.selectedADM5Text='';
			self.levels[3]=self.levels[4]=self.levels[5]=self.levels[6]=null;
			
			// Server request with the selected data
			self.level=2;

			instanceLocal.fire(
				'changeVal', 
				{ continent:self.selectedContinentText,country:getCountryName(self.selectedCountryText),adm1:'',adm2:'',adm3:'',adm4:'',adm5:'' }
			);
			if(self.reach=="country") return;

			if(self.selectedCountryText != 'AD')
				self.geoClick($('a:contains("'+self.selectedCountryText+'")'),instanceLocal);
		});
		
		if((self.selectedCountryIndex < 0 || self.selectedCountryIndex == undefined) && self.selectedCountryText!=''){
			// Ask for country code again, in order to make a correct server request
			self.selectedCountryText = getCountryCode(isoCountries,$('select[id="' + self.country + '"] option:selected').text());
			
			// Clear and deselect the following dropdowns
			self.selectedADM1Index=self.selectedADM2Index=self.selectedADM3Index=self.selectedADM4Index=self.selectedADM5Index=-2;
			self.selectedADM1Text=self.selectedADM2Text=self.selectedADM3Text=self.selectedADM4Text=self.selectedADM5Text='';
			self.levels[3]=self.levels[4]=self.levels[5]=self.levels[6]=null;

			// Server request with the selected data
			self.level=2;
			if(self.reach=="country") return;
			if(self.selectedCountryText != 'AD')
				self.geoClick($('a:contains("'+self.selectedCountryText+'")'),instanceLocal);
		}
	}
}