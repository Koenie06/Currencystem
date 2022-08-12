## Functions

<dl>
<dt><a href="#getUser">getUser(user)</a> ⇒ <code>Promise.&lt;Object&gt;</code></dt>
<dd><p>Get the provided users data.</p>
</dd>
<dt><a href="#addMoney">addMoney(user, amount, place)</a> ⇒ <code>Promise.&lt;Object&gt;</code></dt>
<dd><p>Add a amount of money from the users wallet or bank.</p>
</dd>
<dt><a href="#removeMoney">removeMoney(user, amount, place)</a> ⇒ <code>Promise.&lt;Object&gt;</code></dt>
<dd><p>Remove a amount of money from the users wallet or bank.</p>
</dd>
<dt><a href="#addMoneyAll">addMoneyAll(amount, place)</a> ⇒ <code>Promise.&lt;Array.&lt;Object&gt;&gt;</code></dt>
<dd><p>Give all the users in the DB a amount of money to there wallet or bank.</p>
</dd>
<dt><a href="#removeMoneyAll">removeMoneyAll(amount, place)</a> ⇒ <code>Promise.&lt;Object&gt;</code></dt>
<dd><p>Remove from all the users in the DB a amount of money from there wallet or bank.</p>
</dd>
<dt><a href="#deposit">deposit(user, amount)</a> ⇒ <code>Promise.&lt;Object&gt;</code></dt>
<dd><p>Deposit an amount of money to the users bank.</p>
</dd>
<dt><a href="#withdraw">withdraw(user, amount)</a> ⇒ <code>Promise.&lt;Object&gt;</code></dt>
<dd><p>Withdraw an amount of money from the users bank.</p>
</dd>
<dt><a href="#transferMoney">transferMoney(removeFrom, addTo, amount, place)</a> ⇒ <code>Promise.&lt;Object&gt;</code></dt>
<dd><p>Transfer an amount of money from one user to another.</p>
</dd>
<dt><a href="#gamble">gamble(user, amount, place)</a> ⇒ <code>Promise.&lt;Object&gt;</code></dt>
<dd><p>Double or lose the amount of money by a percentage of 50%.</p>
</dd>
<dt><a href="#getShop">getShop()</a> ⇒ <code>Promise.&lt;Array.&lt;Object&gt;&gt;</code></dt>
<dd><p>Get all the shop items.</p>
</dd>
<dt><a href="#buyItem">buyItem(user, item, place)</a> ⇒ <code>Promise.&lt;Object&gt;</code></dt>
<dd><p>Buy a item from the shop for money.</p>
</dd>
<dt><a href="#sellItem">sellItem(user, item, place)</a> ⇒ <code>Promise.&lt;Object&gt;</code></dt>
<dd><p>Sell a item from the users inventory for money.</p>
</dd>
<dt><a href="#addItem">addItem(name, description, price)</a> ⇒ <code>Promise.&lt;Array.&lt;Object&gt;&gt;</code></dt>
<dd><p>Add a item to the shop list.</p>
</dd>
<dt><a href="#removeItem">removeItem(name)</a> ⇒ <code>Promise.&lt;Array.&lt;Object&gt;&gt;</code></dt>
<dd><p>Remove a item from the shop list.</p>
</dd>
<dt><a href="#setItems">setItems(items)</a> ⇒ <code>Promise.&lt;Array.&lt;Object&gt;&gt;</code></dt>
<dd><p>Override the current shop list and set a new one.</p>
</dd>
<dt><a href="#rob">rob(robber, victim, minimum, maximum, succes)</a> ⇒ <code>Promise.&lt;Object&gt;</code></dt>
<dd><p>Rob the money of the other user, if succeeded the robber will get the money. If failed the robber will lose the money.</p>
</dd>
<dt><a href="#work">work(user, place, minimum, maximum, cooldown)</a> ⇒ <code>Promise.&lt;Object&gt;</code></dt>
<dd><p>Let the user work for money.</p>
</dd>
<dt><a href="#beg">beg(user, minimum, maximum, cooldown)</a> ⇒ <code>Promise.&lt;Object&gt;</code></dt>
<dd><p>Let the user beg for money.</p>
</dd>
<dt><a href="#hourly">hourly(user, amount)</a> ⇒ <code>Promise.&lt;Object&gt;</code></dt>
<dd><p>Claim a reward which can be claimed every hour.</p>
</dd>
<dt><a href="#daily">daily(user, amount)</a> ⇒ <code>Promise.&lt;Object&gt;</code></dt>
<dd><p>Claim a reward which can be claimed every day.</p>
</dd>
<dt><a href="#weekly">weekly(user, amount)</a> ⇒ <code>Promise.&lt;Object&gt;</code></dt>
<dd><p>Claim a reward which can be claimed every week.</p>
</dd>
<dt><a href="#monthly">monthly(user, amount)</a> ⇒ <code>Promise.&lt;Object&gt;</code></dt>
<dd><p>Claim a reward which can be claimed every month.</p>
</dd>
<dt><a href="#yearly">yearly(user, amount)</a> ⇒ <code>Promise.&lt;Object&gt;</code></dt>
<dd><p>Claim a reward which can be claimed every year.</p>
</dd>
</dl>

<a name="getUser"></a>

## getUser(user) ⇒ <code>Promise.&lt;Object&gt;</code>
Get the provided users data.

**Kind**: global function
**Returns**: <code>Promise.&lt;Object&gt;</code> - CurrencyUser class with user data.

| Param | Type | Description |
| --- | --- | --- |
| user | <code>String</code> | The user to get the data of. |

<a name="addMoney"></a>

## addMoney(user, amount, place) ⇒ <code>Promise.&lt;Object&gt;</code>
Add a amount of money from the users wallet or bank.

**Kind**: global function
**Returns**: <code>Promise.&lt;Object&gt;</code> - The user and the amount of money he has.

| Param | Type | Description |
| --- | --- | --- |
| user | <code>String</code> | The user to add the money to. |
| amount | <code>Number</code> | The amount of money to add. |
| place | <code>String</code> | The place to add the money to. |

<a name="removeMoney"></a>

## removeMoney(user, amount, place) ⇒ <code>Promise.&lt;Object&gt;</code>
Remove a amount of money from the users wallet or bank.

**Kind**: global function
**Returns**: <code>Promise.&lt;Object&gt;</code> - The user and the amount of money he has.

| Param | Type | Description |
| --- | --- | --- |
| user | <code>String</code> | The user to remove the money from. |
| amount | <code>Number</code> | The amount of money to remove. |
| place | <code>String</code> | The place to remove the money from. |

<a name="addMoneyAll"></a>

## addMoneyAll(amount, place) ⇒ <code>Promise.&lt;Array.&lt;Object&gt;&gt;</code>
Give all the users in the DB a amount of money to there wallet or bank.

**Kind**: global function
**Returns**: <code>Promise.&lt;Array.&lt;Object&gt;&gt;</code> - All the users and the amount of money they have.

| Param | Type | Description |
| --- | --- | --- |
| amount | <code>Number</code> | The amount of money to add. |
| place | <code>String</code> | The place to store the money in. |

<a name="removeMoneyAll"></a>

## removeMoneyAll(amount, place) ⇒ <code>Promise.&lt;Object&gt;</code>
Remove from all the users in the DB a amount of money from there wallet or bank.

**Kind**: global function
**Returns**: <code>Promise.&lt;Object&gt;</code> - All the users and the amount of money they have.

| Param | Type | Description |
| --- | --- | --- |
| amount | <code>Number</code> | The amount of money to remove. |
| place | <code>String</code> | The place to remove the money from. |

<a name="deposit"></a>

## deposit(user, amount) ⇒ <code>Promise.&lt;Object&gt;</code>
Deposit an amount of money to the users bank.

**Kind**: global function
**Returns**: <code>Promise.&lt;Object&gt;</code> - The user and the amount of money he has.

| Param | Type | Description |
| --- | --- | --- |
| user | <code>String</code> | The user to deposit the money to. |
| amount | <code>Number</code> | The amount of money to deposit. |

<a name="withdraw"></a>

## withdraw(user, amount) ⇒ <code>Promise.&lt;Object&gt;</code>
Withdraw an amount of money from the users bank.

**Kind**: global function
**Returns**: <code>Promise.&lt;Object&gt;</code> - The user and the amount of money he has.

| Param | Type | Description |
| --- | --- | --- |
| user | <code>String</code> | The user to withdraw the money from. |
| amount | <code>Number</code> | The amount of money to withdraw. |

<a name="transferMoney"></a>

## transferMoney(removeFrom, addTo, amount, place) ⇒ <code>Promise.&lt;Object&gt;</code>
Transfer an amount of money from one user to another.

**Kind**: global function
**Returns**: <code>Promise.&lt;Object&gt;</code> - The users and the amount of money they have.

| Param | Type | Description |
| --- | --- | --- |
| removeFrom | <code>String</code> | The user to remove the money from. |
| addTo | <code>String</code> | The user to add the money to. |
| amount | <code>Number</code> | The amount of money to transfer. |
| place | <code>String</code> | The place to transfer the money from. |

<a name="gamble"></a>

## gamble(user, amount, place) ⇒ <code>Promise.&lt;Object&gt;</code>
Double or lose the amount of money by a percentage of 50%.

**Kind**: global function
**Returns**: <code>Promise.&lt;Object&gt;</code> - The user and the amount of money he has.  

| Param | Type | Description |
| --- | --- | --- |
| user | <code>String</code> | The user to double or lose the money from. |
| amount | <code>Number</code> | The amount of money to double or lose. |
| place | <code>String</code> | The place to double or lose the money from. |

<a name="getShop"></a>

## getShop() ⇒ <code>Promise.&lt;Array.&lt;Object&gt;&gt;</code>
Get all the shop items.

**Kind**: global function
**Returns**: <code>Promise.&lt;Array.&lt;Object&gt;&gt;</code> - A list of all the CurrencyItems in the shop
<a name="buyItem"></a>

## buyItem(user, item, place) ⇒ <code>Promise.&lt;Object&gt;</code>
Buy a item from the shop for money.

**Kind**: global function
**Returns**: <code>Promise.&lt;Object&gt;</code> - The user and the amount of money he has.

| Param | Type | Description |
| --- | --- | --- |
| user | <code>String</code> | The user which buys the item. |
| item | <code>String</code> | The item to buy. |
| place | <code>String</code> | The place to remove the money from. |

<a name="sellItem"></a>

## sellItem(user, item, place) ⇒ <code>Promise.&lt;Object&gt;</code>
Sell a item from the users inventory for money.

**Kind**: global function
**Returns**: <code>Promise.&lt;Object&gt;</code> - The user and the amount of money he has.

| Param | Type | Description |
| --- | --- | --- |
| user | <code>String</code> | The user which sells the item. |
| item | <code>String</code> | The item to sell. |
| place | <code>String</code> | The place to add the money to. |

<a name="addItem"></a>

## addItem(name, description, price) ⇒ <code>Promise.&lt;Array.&lt;Object&gt;&gt;</code>
Add a item to the shop list.

**Kind**: global function
**Returns**: <code>Promise.&lt;Array.&lt;Object&gt;&gt;</code> - The shop list.

| Param | Type | Description |
| --- | --- | --- |
| name | <code>String</code> | The name of the item. |
| description | <code>String</code> | The description of the item. |
| price | <code>Number</code> | The price of the item. |

<a name="removeItem"></a>

## removeItem(name) ⇒ <code>Promise.&lt;Array.&lt;Object&gt;&gt;</code>
Remove a item from the shop list.

**Kind**: global function
**Returns**: <code>Promise.&lt;Array.&lt;Object&gt;&gt;</code> - The shop list.

| Param | Type | Description |
| --- | --- | --- |
| name | <code>String</code> | The name of the item. |

<a name="setItems"></a>

## setItems(items) ⇒ <code>Promise.&lt;Array.&lt;Object&gt;&gt;</code>
Override the current shop list and set a new one.

**Kind**: global function
**Returns**: <code>Promise.&lt;Array.&lt;Object&gt;&gt;</code> - The shop list.

| Param | Type | Description |
| --- | --- | --- |
| items | <code>Array.&lt;CurrencyItem&gt;</code> \| <code>Array.&lt;Object&gt;</code> | The items to save. |

<a name="rob"></a>

## rob(robber, victim, minimum, maximum, succes) ⇒ <code>Promise.&lt;Object&gt;</code>
Rob the money of the other user, if succeeded the robber will get the money. If failed the robber will lose the money.

**Kind**: global function
**Returns**: <code>Promise.&lt;Object&gt;</code> - If succeeded and the amount of money robbed. If failed and the amount of money lost.

| Param | Type | Description |
| --- | --- | --- |
| robber | <code>String</code> | The user who is robbing. |
| victim | <code>String</code> | The user who is getting robbed. |
| minimum | <code>Number</code> | The minimum amount of money the robber can rob. |
| maximum | <code>Number</code> | The maximum amount of money the robber can rob. |
| succes | <code>Number</code> | The chance of the robber to succeed. |

<a name="work"></a>

## work(user, place, minimum, maximum, cooldown) ⇒ <code>Promise.&lt;Object&gt;</code>
Let the user work for money.

**Kind**: global function
**Returns**: <code>Promise.&lt;Object&gt;</code> - The amount of money the user worked for and the user data.

| Param | Type | Description |
| --- | --- | --- |
| user | <code>String</code> | The user who is working. |
| place | <code>String</code> | The place where to store the money. |
| minimum | <code>Number</code> | The minimum amount of money the user can work for. |
| maximum | <code>Number</code> | The maximum amount of money the user can work for. |
| cooldown | <code>Number</code> | The cooldown in milliseconds the user has to wait before working again. |

<a name="beg"></a>

## beg(user, minimum, maximum, cooldown) ⇒ <code>Promise.&lt;Object&gt;</code>
Let the user beg for money.

**Kind**: global function
**Returns**: <code>Promise.&lt;Object&gt;</code> - The amount of money the user begged for and the user data.

| Param | Type | Description |
| --- | --- | --- |
| user | <code>String</code> | The user who is begging. |
| minimum | <code>Number</code> | The minimum amount of money the user can beg for. |
| maximum | <code>Number</code> | The maximum amount of money the user can beg for. |
| cooldown | <code>Number</code> | The cooldown in milliseconds the user has to wait before begging again. |

<a name="hourly"></a>

## hourly(user, amount) ⇒ <code>Promise.&lt;Object&gt;</code>
Claim a reward which can be claimed every hour.

**Kind**: global function
**Returns**: <code>Promise.&lt;Object&gt;</code> - The user and the amount of money he has.

| Param | Type | Description |
| --- | --- | --- |
| user | <code>String</code> | The user who is claiming the reward. |
| amount | <code>Number</code> | The amount of money the user can claim for the reward. |

<a name="daily"></a>

## daily(user, amount) ⇒ <code>Promise.&lt;Object&gt;</code>
Claim a reward which can be claimed every day.

**Kind**: global function
**Returns**: <code>Promise.&lt;Object&gt;</code> - The user and the amount of money he has.

| Param | Type | Description |
| --- | --- | --- |
| user | <code>String</code> | The user who is claiming the reward. |
| amount | <code>Number</code> | The amount of money the user can claim for the reward. |

<a name="weekly"></a>

## weekly(user, amount) ⇒ <code>Promise.&lt;Object&gt;</code>
Claim a reward which can be claimed every week.

**Kind**: global function
**Returns**: <code>Promise.&lt;Object&gt;</code> - The user and the amount of money he has.

| Param | Type | Description |
| --- | --- | --- |
| user | <code>String</code> | The user who is claiming the reward. |
| amount | <code>Number</code> | The amount of money the user can claim for the reward. |