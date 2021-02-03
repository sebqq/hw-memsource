export const mockComponent = <T extends Object>(
  moduleName: string,
  propOverrideFn: (props: T) => Partial<T>
) => {
  // @ts-ignore
  const RealComponent = require.requireActual(moduleName);

  const React = require("react");
  const CustomizedComponent = (props: T) => {
    return React.createElement("CustomizedComponent", {
      ...props,
      ...propOverrideFn(props),
    });
  };

  CustomizedComponent.propTypes = RealComponent.propTypes;
  return CustomizedComponent;
};
