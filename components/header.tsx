import styles from "../styles/Home.module.scss";
import classNames from "classnames/bind";
import Link from "next/link";

let cx = classNames.bind(styles);

const headerClasses = cx({
  wrapper: true,
  headerContainer: true,
});

export const Header = () => (
  <header className={styles.header}>
    <div className={headerClasses}>
      <Link href="/">
        <a>
          <h1>
            Stripwinkelzoeker<span>.nl</span>
          </h1>
        </a>
      </Link>

      <h3>Koop je strips bij een stripspeciaalzaak!</h3>
    </div>
  </header>
);
