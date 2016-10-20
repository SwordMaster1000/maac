<div class="page__base" data-remote="true" data-route="^(?:\/home|\/index\.php|\/$)(?:\/)?(.*)$"></div>
<div class="page__base" data-remote="true" data-route="^\/projects\/ourproduct\/?(.*)$"></div>
<div class="page__base" data-remote="true" data-route="^\/projects\/researchpaper\/?(.*)$"></div>
<div class="page__base" data-remote="true" data-route="^\/projects\/outreach\/?(.*)$"></div>
<div class="page__base" data-remote="true" data-route="^\/projects\/game\/?(.*)$"></div>
<div class="page__base" data-remote="true" data-route="^\/ourcompany\/boardofdirectors\/?(.*)$"></div>
<div class="page__base" data-remote="true" data-route="^\/ourcompany\/roboticsdivision\/?(.*)$"></div>
<div class="page__base" data-remote="true" data-route="^\/ourcompany\/notebookdivision\/?(.*)$"></div>
<div class="page__base" data-remote="true" data-route="^\/ourcompany\/displaydivision\/?(.*)$"></div>
<div class="page__base" data-remote="true" data-route="^\/ourcompany\/mediadivision\/?(.*)$"></div>
<div class="page__base" data-remote="true" data-route="^\/ourcompany\/marketingdivision\/?(.*)$"></div>
<div class="page__base" data-remote="true" data-route="^\/sponsors\/?(.*)$"></div>
<div class="viewing page__base" data-route="^\/contactus\/?(.*)$">
    <h1 class="contactus__heading">
        Contact Us
    </h1>
    <form class="contactus__form" id="contactForm" action="/static/inc/submitform.php" method="POST">
        <label for="name">Name:</label><br>
        <input id="name" type="text" name="name" placeholder="Required" required>
        <br>
        <label for="companyName">Company Name:</label><br>
        <input id="companyName" type="text" name="companyname" placeholder="Optional">
        <br>
        <label for="email">Email:</label><br>
        <input id="email" type="email" name="email" placeholder="Required" required>
        <br>
        <br>
        <label for="subject">Subject:</label><br>
        <input id="subject" type="text" name="subject" placeholder="Required" required>
        <br>
        <label for="msg">Message:</label><br>
        <textarea id="msg" name="msg" placeholder="Required" required></textarea>
        <button type="submit" class="green"><span>Send</span></button>
    </form>
    <br>            
    <br>
    <br>
    <br>
    <br>
</div>
<div class="page__base" data-remote="true" data-route="^\/ourcompany\/spirit\/?(.*)$"></div>