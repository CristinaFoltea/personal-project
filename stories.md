1. on the home page the user can choose to sign in if they have an account or to log in with twitter
  a. If the user wants to log in after clicking the log in button a new page is opening where the user has to input the email and the password. If there is data on the user in the database, the user is redirected to home page, if not an error massage will show at the bottom the sign in form, and the user can try again or can register
2. if they logged in the the conner top should say Hello and the full Name |logout | home
3. On the home page the users can fill up a form that should generate travel destinations for them
4. The "Enter the location of the closest airport" field should autocomplete the location
5. The date's inputs should have a date picker calendary
6. The submit button should take them to a new page with the a list of potentials travel destinations
7. Every row with destinations should have the location, price a 'save' button and 'see city on intagram' button
8. The save button should save the city in the database for the user under a bucket list
9. See city on instagram should take the user to a new page with the most recent post that have a specific city as tag.


<!-- <span class="city_name">{{{trimCity city}}}</span>
<span class="price">${{price}}</span>
<button type="button" id="button" onClick="save(this)">Save</button>
<a href="/photos/{{city}}" class="button insta" id='{{code}}' target="_blank">See {{city}} on Instagram</a>
<p class"break"> </p> -->

<!-- <table>
  <tr>
    <td class="city_name">
      {{{city}}}
    </td>
    <td class="price">
      ${{price}}
    </td>
    <td>
      <button type="button" id="button" onClick="save(this)">Save</button>
    </td>
    <td>
      <a href="/photos/{{city}}" class="button insta" id='{{code}}' target="_blank">See {{city}} on Instagram</a>
    </td>
  </tr>
</table> -->

<!-- Handlebars.registerHelper('trimCity', function(city) {
    var trimCity = city.replace('%20', " ");
    return new Handlebars.SafeString(trimCity)
}); -->
