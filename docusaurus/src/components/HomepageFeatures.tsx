/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React from 'react';
import clsx from 'clsx';
import styles from './HomepageFeatures.module.css';

type FeatureItem = {
  title: string;
  image: string;
  description: JSX.Element;
};

const FeatureList: FeatureItem[] = [
  {
    title: '易于上手',
    image: 'https://ruqi-static.ruqimobility.com/pic_image/20211117110010__J5OIPOJS.svg',
    description: null,
  },
  {
    title: '无侵入式采集',
    image: 'https://ruqi-static.ruqimobility.com/pic_image/20211117110010__KCES7SDS.svg',
    description: null,
  },
  {
    title: '搭配Sentry驱动',
    image: 'https://ruqi-static.ruqimobility.com/pic_image/20211117110010__I22ECT0K.svg',
    description: null,
  },
];

function Feature({title, image, description}: FeatureItem) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
        <img className={styles.featureSvg} alt={title} src={image} />
      </div>
      <div className="text--center padding-horiz--md">
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures(): JSX.Element {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
