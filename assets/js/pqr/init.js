/**
 * @fileoverview Initialize the app on document ready. Should be the last file. 
 * @author JoshJRogan@gmail.com (Josh Rogan)
 * @author ritwikg2004@live.com (Ritwik Gupta)
 */

/**
 * Initialize the app on document ready
 *  
 */
pqr.init = function() {
	$(document).ready(function() {
		if(pqr.debug) console.log("Loading PQR Web App....");  

		//All page initializer 
		pqr.checkFeatures(); 
		bootstrapUtilities.FullToolTipOptIn();
		pqr.htmlUtilities.initFontSize(); 
		pqr.bindevents.bindFontSwitchers();
		htmlutilities.footerToBottom('footer', '#main');

		if ($("#main").hasClass("page-home")) {
			pqr.threeDMole.initViewers();
			pqr.bindevents.moleculeReset('#reset-molecule');
			pqr.bindevents.moleculeToggleRotation('#rotationSwitch');
		}
		else if ($("#main").hasClass("page-molecule")) {
			pqr.threeDMole.initViewers();
			pqr.htmlUtilities.updatePropertiesViewer();
			pqr.htmlUtilities.initQuickFit("#molecule-name", {min: 12, max:36}); 

			pqr.bindevents.propertiesViewerHandler();
			pqr.bindevents.moleculeStyleChanger();
			pqr.bindevents.moleculeReset('#reset-molecule');
			pqr.bindevents.moleculeToggleRotation('#rotationSwitch');
			pqr.bindevents.moleculeToggleSurface('.surfaceSwitch');
			pqr.bindevents.printButton('#print-molecule');

			pqr.qrgen.addQRCode("#qrcode", pqr.htmlUtilities.getQRURL());
			pqr.qrgen.addQRCode("#qr-print-wrapper", pqr.htmlUtilities.getQRURL());
		}
		else if($("#main").hasClass("page-browse")){
			pqr.masonary.init(); 
			$('.molecule-results-masonary').removeClass('translucent'); 
		}

		if(pqr.debug) console.log("Finished loading PQR Web App!"); 
	});
}();
