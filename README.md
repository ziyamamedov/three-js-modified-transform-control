# Modified transform control for three.js(WIP)

In this project I improved the standart TransformControl for three.js. Improvements:

- **Selection** and **deselection** of different objects(Before you could add only one obj through code)
- Changing transform mode through **GUI**
- Displaying and updating object's **transform values in GUI**

More improvents and fixes to come :)

**Attention!** In case you wanna use this control in your project it is important to add `{isSelectable: true}` to your meshes's userData, like so:

```js
  cubeMesh.userData = {isSelectable: true}
```

Demo: https://three-js-modified-transform.netlify.app/