import React from "react"
import loadable from "loadable-components";

import LoadingComponent       from "../ui/components/LoadingComponent"

const DynamicImporter = component => loadable(component, {
    LoadingComponent
  });

export default DynamicImporter
