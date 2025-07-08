export default function useAnimations() {
  function beforeEnter(el) {
    el.style.height = "0";
    el.style.opacity = "0";
  }

  function enter(el, done) {
    const height = el.scrollHeight;
    el.style.transition = "all 0.3s ease-in-out";
    el.style.height = height + "px";
    el.style.opacity = "1";

    el.addEventListener(
      "transitionend",
      () => {
        el.style.height = "auto";
        done();
      },
      { once: true }
    );
  }

  function leave(el, done) {
    el.style.height = el.scrollHeight + "px";
    el.style.opacity = "1";
    void el.offsetHeight;

    el.style.transition = "all 0.3s ease";
    el.style.height = "0";
    el.style.opacity = "0";

    el.addEventListener("transitionend", done, { once: true });
  }

  return { beforeEnter, leave, enter };
}
